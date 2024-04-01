import { Type } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { PgProtoParserOptions } from '../../options';
export declare const generateTypeImports: (types: Type[], source: string, suffix?: string) => t.ImportDeclaration;
export declare const generateAstHelperMethods: (types: Type[]) => t.ExportDefaultDeclaration;
export declare const generateNodeUnionType: (types: Type[]) => t.ExportNamedDeclaration;
export declare const convertTypeToTsInterface: (type: Type, options: PgProtoParserOptions) => t.ExportNamedDeclaration;
export declare const convertTypeToWrappedTsInterface: (type: Type, options: PgProtoParserOptions) => t.ExportNamedDeclaration;
export declare const generateTypeImportSpecifiers: (types: Type[], options: PgProtoParserOptions) => t.ImportDeclaration;
