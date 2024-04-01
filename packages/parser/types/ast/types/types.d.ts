import { Type } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { PgProtoParserOptions } from '../../options';
export declare const createAstHelperMethodsAST: (types: Type[]) => t.ExportDefaultDeclaration;
export declare const createNodeUnionTypeAST: (types: Type[]) => t.ExportNamedDeclaration;
export declare const transformTypeToAST: (type: Type, options: PgProtoParserOptions, useNestedTypes: boolean) => t.ExportNamedDeclaration;
export declare const generateTSInterfaces: (types: Type[], options: PgProtoParserOptions, useNestedTypes: boolean) => any[];
export declare const generateImportSpecifiersAST: (types: Type[], options: PgProtoParserOptions) => t.ImportDeclaration;
