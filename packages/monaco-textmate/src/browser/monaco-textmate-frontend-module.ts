/*
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces, ContainerModule } from 'inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { MonacoTextmateFrontendApplicationContribution } from './monaco-textmate-frontend-contribution';
import { bindContributionProvider } from '@theia/core';
import { TypescriptLanguageGrammarContribution } from './typescript-textmate-contribution';
import { LanguageGrammarDefinitionContribution } from './textmate-contribution';
import { MonacoTextmateService } from './monaco-textmate-service';
import { JavascriptLanguageGrammarContribution } from './javascript-textmate-contribution';
import { TextmateRegistry, TextmateRegistryImpl } from './textmate-registry';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    bind(FrontendApplicationContribution).to(MonacoTextmateFrontendApplicationContribution).inSingletonScope();
    bind(MonacoTextmateService).toSelf().inSingletonScope();

    bindContributionProvider(bind, LanguageGrammarDefinitionContribution);

    bind(TextmateRegistry).to(TextmateRegistryImpl).inSingletonScope();

    bind(LanguageGrammarDefinitionContribution).to(TypescriptLanguageGrammarContribution);
    bind(LanguageGrammarDefinitionContribution).to(JavascriptLanguageGrammarContribution);
});
