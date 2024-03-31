import { Enum } from '@launchql/protobufjs';
import * as t from '@babel/types';
export declare const transformEnumToAST: (enumData: Enum) => t.ExportNamedDeclaration;
export declare const transformEnumToTypeUnionAST: (enumData: Enum) => t.ExportNamedDeclaration;
export declare const buildEnumValueFunctionAST: (enumData: Enum[]) => t.ExportNamedDeclaration[];
