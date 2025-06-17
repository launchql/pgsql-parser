import { Enum } from '@launchql/protobufjs';
import * as t from '@babel/types';
export declare const convertEnumToTsEnumDeclaration: (enumData: Enum) => t.ExportNamedDeclaration;
export declare const generateEnumImports: (enums: Enum[], source: string) => t.ImportDeclaration;
export declare const convertEnumToTsUnionType: (enumData: Enum) => t.ExportNamedDeclaration;
export declare const generateEnumValueFunctions: (enumData: Enum[]) => t.ExportNamedDeclaration[];
