import { Type } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { PgProtoParserOptions } from '../../options';
export declare const createAstHelperMethodsAST: (types: Type[]) => t.ExportDefaultDeclaration;
export declare const createUnionTypeAST: (types: Type[]) => t.ExportNamedDeclaration;
export declare const transformTypeToAST: (type: Type, options: PgProtoParserOptions, useNestedTypes: boolean) => t.ExportNamedDeclaration;
