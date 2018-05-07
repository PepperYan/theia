/*
 * Copyright (C) 2018 Redhat, Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject, named } from "inversify";
import { LanguageGrammarDefinitionContribution } from "./textmate-contribution";
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { ContributionProvider, ILogger, Disposable, DisposableCollection } from "@theia/core";
import { TextmateRegistry } from "./textmate-registry";
import { MonacoTextModelService } from "@theia/monaco/lib/browser/monaco-text-model-service";

@injectable()
export class MonacoTextmateService implements Disposable {

    protected textmateRegistry: Registry;
    @inject(ContributionProvider) @named(LanguageGrammarDefinitionContribution)
    protected readonly grammarProviders: ContributionProvider<LanguageGrammarDefinitionContribution>;
    @inject(TextmateRegistry) protected readonly theiaRegistry: TextmateRegistry;
    @inject(MonacoTextModelService) protected readonly monacoModelService: MonacoTextModelService;
    @inject(ILogger) protected readonly logger: ILogger;

    protected readonly toDispose = new DisposableCollection();

    constructor() { }

    init() {
        // this.grammarDefinition = grammarProviders.getContributions().map(grammarProvider =>
        //     grammarProvider.getGrammarDefinition()
        // );
        this.grammarProviders.getContributions().forEach(grammarProvider => {
            grammarProvider.registerTextmateLanguage(this.theiaRegistry);
        });

        this.textmateRegistry = new Registry({
            getGrammarDefinition: async (scopeName: string, dependentScope: string) => {
                if (this.theiaRegistry.hasProvider(scopeName)) {
                    const provider = this.theiaRegistry.getProvider(scopeName);
                    return await provider!.getGrammarDefinition(scopeName, dependentScope);
                }
                return {
                    format: 'json',
                    content: ''
                };
            },
            getFilePath: () => ''
        });

        /**
         * TODO wire textmate grammars with the appropriate
         * language ID -> scopeName from TM using wireTmGrammars
         * (https://github.com/NeekSandhu/monaco-editor-textmate/blob/master/src/index.ts#L36)
         */

        // this.grammarDefinition.forEach(grammar => {
        //     grammars.set(grammar.languageId, grammar.scopeName);
        // });

        // wireTmGrammars(monaco, this.textmateRegistry, grammars);
        // }

        this.toDispose.push(this.monacoModelService.onDidCreate(model => {
            this.activateLanguage(model.languageId);
        }));
    }

    async activateLanguage(languageId: string) {
        const scopeName = this.theiaRegistry.getScope(languageId);
        if (!scopeName) {
            return;
        }
        const provider = this.theiaRegistry.getProvider(scopeName);
        if (!provider) {
            return;
        }

        try {
            await wireTmGrammars(monaco, this.textmateRegistry, new Map([[languageId, scopeName]]));
        } catch (err) {
            this.logger.warn('No grammar for this language id', languageId);
        }
    }

    dispose(): void {
        this.toDispose.dispose();
    }
}
