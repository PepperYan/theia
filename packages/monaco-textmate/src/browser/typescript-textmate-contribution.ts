/*
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { LanguageGrammarDefinitionContribution } from './textmate-contribution';
import { injectable } from 'inversify';
import { TextmateRegistry } from './textmate-registry';
const grammar = require('../../src/browser/typescript.tmlanguage.json');

@injectable()
export class TypescriptLanguageGrammarContribution implements LanguageGrammarDefinitionContribution {

    // @inject(TextmateRegistry) protected readonly tmRegistry: TextmateRegistry;

    registerTextmateLanguage(registry: TextmateRegistry): void {
        registry.registerTextMateGrammarScope('source.ts',
            {
                async getGrammarDefinition() {
                    return {
                        format: 'json',
                        content: JSON.stringify(grammar)
                    };
                },
                getFilePath: () => ''
            });

        registry.mapLanguageIdToTextmateGrammar('typescript', 'source.ts');

    }
    // registerTextMateGrammarScope(scopeName: string, provider: RegistryOptions): void {
    //     this.tmRegistry.registerTextMateGrammarScope('source.ts',
    //         {
    //             async getGrammarDefinition() {
    //                 return {
    //                     format: 'json',
    //                     content: grammar
    //                 };
    //             },
    //             getFilePath: () => ''
    //         });
    // }
    // mapLanguageIdToTextmateGrammar(language: string, scopeName: string): void {
    //     this.tmRegistry.mapLanguageIdToTextmateGrammar('typescript', 'source.ts');

    // }
    // getGrammarDefinition(): LanguageGrammarDefinition {
    //     return {
    //         languageId: 'typescript',
    //         scopeName: 'source.ts',
    //         format: 'json',
    //         content: grammar
    //     };
    // }
}
