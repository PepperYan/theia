/*
 * Copyright (C) 2018 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

/* FIXME remove  as this is probably not needed if we use monaco-textmate */
// import { injectable, inject } from 'inversify';
// import { WidgetManager } from '@theia/core/lib/browser';
// import { EditorWidget } from "@theia/editor/lib/browser";
// import { MonacoEditor } from "@theia/monaco/lib/browser/monaco-editor";
// import { Disposable } from '@theia/core/lib/common';
// import { setTimeout, clearTimeout } from 'timers';
// import { TextmateService } from './monaco-textmate-service';

// // class LinePart {
// //     _linePartBrand: void;

// //     /**
// //      * last char index of this token (not inclusive).
// //      */
// //     public readonly endIndex: number;
// //     public readonly type: string;

// //     constructor(endIndex: number, type: string) {
// //         this.endIndex = endIndex;
// //         this.type = type;
// //     }
// // }

// @injectable()
// export class MonacoTextmateColorizer {

//     private editors = new Set<MonacoEditor>();
//     // private editorToDecoration = new Map<MonacoEditor, string[]>();
//     private timer: Disposable;
//     constructor(@inject(WidgetManager) widgetManager: WidgetManager,
//         @inject(TextmateService) readonly textmateService: TextmateService) {
//         this.timer = Disposable.create(() => { });
//         widgetManager.onDidCreateWidget(e => {
//             if (e.widget instanceof EditorWidget) {
//                 if (e.widget.editor instanceof MonacoEditor) {
//                     const monaco: MonacoEditor = e.widget.editor;
//                     this.editors.add(monaco);
//                     monaco.onDocumentContentChanged(e => {
//                         this.timer.dispose();
//                         const t = setTimeout(() => {
//                             this.handleChanges(monaco);
//                         }, 200);
//                         this.timer = Disposable.create(() => clearTimeout(t));
//                     });
//                     this.handleChanges(monaco);
//                 }
//             }
//         });
//     }

//     private handleChanges(editor: MonacoEditor): void {
//         const e = editor.document;
//         const text = e.getText();
//         const lines = text.split(/\r\n|\r|\n/);
//         this.textmateService.parse(e.uri, lines).then(val => {
//             this.createAnnotations(lines, val, editor);
//         }).catch(e => {
//             console.error(e);
//         });
//     }

//     createAnnotations(lines: string[], tokens: number[][], monaco: MonacoEditor): void {
//         // const decorations: monaco.editor.IModelDeltaDecoration[] = [];
//         // for (let i = 0; i < lines.length; i++) {
//         //     const line = lines[i];
//         //     const lineTokenArray = new Uint32Array(tokens[i]);
//         //     // const lineTokens = ViewLineTokenFactory.inflateArr(lineTokenArray);
//         //     // const linePart = transformAndRemoveOverflowing(new ViewLineTokens(lineTokens), 0, line.length);
//         //     let index = 1;
//         //     for (let j = 0; j < linePart.length; j++) {
//         //         const token = linePart[j];
//         //         decorations.push({
//         //             range: {
//         //                 startLineNumber: i + 1,
//         //                 endLineNumber: i + 1,
//         //                 startColumn: index,
//         //                 endColumn: token.endIndex + 1
//         //             },
//         //             options: {
//         //                 inlineClassName: token.type
//         //             }
//         //         });
//         //         index = token.endIndex + 1;
//         //     }
//         // }
//         // let oldDecorations = this.editorToDecoration.get(monaco);
//         // if (!oldDecorations) {
//         //     oldDecorations = [];
//         // }
//         // // oldDecorations = monaco.deltaDecorations(oldDecorations, decorations);
//         // this.editorToDecoration.set(monaco, oldDecorations);
//     }
// }

// /**
//  * In the rendering phase, characters are always looped until token.endIndex.
//  * Ensure that all tokens end before `len` and the last one ends precisely at `len`.
//  */
// // function transformAndRemoveOverflowing(tokens: IViewLineTokens, fauxIndentLength: number, len: number): LinePart[] {
// //     const result: LinePart[] = [];
// //     let resultLen = 0;

// //     // The faux indent part of the line should have no token type
// //     if (fauxIndentLength > 0) {
// //         result[resultLen++] = new LinePart(fauxIndentLength, '');
// //     }

// //     for (let tokenIndex = 0, tokensLen = tokens.getCount(); tokenIndex < tokensLen; tokenIndex++) {
// //         const endIndex = tokens.getEndOffset(tokenIndex);
// //         if (endIndex <= fauxIndentLength) {
// //             // The faux indent part of the line should have no token type
// //             continue;
// //         }
// //         const type = tokens.getClassName(tokenIndex);
// //         if (endIndex >= len) {
// //             result[resultLen++] = new LinePart(len, type);
// //             break;
// //         }
// //         result[resultLen++] = new LinePart(endIndex, type);
// //     }

// //     return result;
// // }
