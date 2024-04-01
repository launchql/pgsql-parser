import { Type } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { PgProtoParserOptions } from '../../options';
export declare const buildTypeNamedImports: (types: Type[], source: string, suffix?: string) => t.ImportDeclaration;
export declare const createAstHelperMethodsAST: (types: Type[]) => t.ExportDefaultDeclaration;
export declare const createNodeUnionTypeAST: (types: Type[]) => t.ExportNamedDeclaration;
export declare const transformTypeToTSInterface: (type: Type, options: PgProtoParserOptions) => t.ExportNamedDeclaration;
export declare const transformTypeToTSWrappedInterface: (type: Type, options: PgProtoParserOptions) => t.ExportNamedDeclaration;
export declare const generateImportSpecifiersAST: (types: Type[], options: PgProtoParserOptions) => t.ImportDeclaration;
