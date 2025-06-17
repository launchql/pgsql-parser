import * as t from '@babel/types';
export declare const convertAstToCode: (body: any[]) => string;
export declare const createDefaultImport: (importName: string, source: string) => t.ImportDeclaration;
export declare const createNamedImport: (importNames: string[], source: string) => t.ImportDeclaration;
export declare const createNamedImportAsSuffix: (importNames: string[], source: string, suffix: string) => t.ImportDeclaration;
