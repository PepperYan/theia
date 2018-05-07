/*
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Call back for extensions to contribute language grammar definitions
 */

export const LanguageGrammarDefinitionContribution = Symbol('LanguageGrammarDefinitionContribution');
// import { RegistryOptions } from "monaco-textmate";
import { TextmateRegistry } from "./textmate-registry";

export interface LanguageGrammarDefinitionContribution {
    registerTextmateLanguage(registry: TextmateRegistry): void;
}

// export interface LanguageGrammarDefinition {
//     languageId: string;
//     scopeName: string;
//     format: 'json' | 'plist';
//     content: string;
// }
