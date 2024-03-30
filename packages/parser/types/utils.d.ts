import { Enum, Field, ReflectionObject } from '@launchql/protobufjs';
import { PgProtoParserOptions } from './types';
export declare const getUndefinedKey: (enumName: any) => string;
export declare const hasUndefinedInitialValue: (enumData: Enum) => boolean;
export declare const cloneAndNameNode: (node: ReflectionObject, name: string) => any;
export declare const getFieldName: (field: Field, fallbackName: string) => any;
export declare const getHeader: () => string;
export declare const writeFileToDisk: (path: string, contents: string, options: PgProtoParserOptions) => void;
