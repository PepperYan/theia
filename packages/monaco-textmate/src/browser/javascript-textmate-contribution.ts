/*
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { LanguageGrammarDefinitionContribution } from './textmate-contribution';
import { injectable } from 'inversify';
import { TextmateRegistry } from './textmate-registry';
const grammar = require('../../src/browser/javascript-tmlanguage.json');

@injectable()
export class JavascriptLanguageGrammarContribution implements LanguageGrammarDefinitionContribution {

    registerTextmateLanguage(registry: TextmateRegistry): void {
        registry.registerTextMateGrammarScope('source.js',
            {
                async getGrammarDefinition() {
                    return {
                        format: 'json',
                        content: grammar
                    };
                },
                getFilePath: () => ''
            });

        registry.mapLanguageIdToTextmateGrammar('javascript', 'source.js');

    }
}
