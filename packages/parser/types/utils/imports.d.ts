import * as t from '@babel/types';
export declare const createDefaultImport: (importName: string, source: string) => t.ImportDeclaration;
export declare const createNamedImport: (importNames: string[], source: string) => t.ImportDeclaration;
