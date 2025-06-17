import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { PgProtoStoreOptions } from './options';
import * as t from '@babel/types';
interface IProtoStore {
    options: PgProtoStoreOptions;
    root: ReflectionObject;
    services: Service[];
    types: Type[];
    fields: Field[];
    enums: Enum[];
    namespaces: Namespace[];
    _parse(node: ReflectionObject): void;
}
export declare class ProtoStore implements IProtoStore {
    options: PgProtoStoreOptions;
    root: ReflectionObject;
    services: Service[];
    types: Type[];
    fields: Field[];
    enums: Enum[];
    namespaces: Namespace[];
    private _runtimeSchema?;
    constructor(root: ReflectionObject, options?: PgProtoStoreOptions);
    _parse(node: ReflectionObject, name?: string): void;
    _processEnum(enumNode: Enum): Enum;
    write(): void;
    writeEnumsJSON(): void;
    allTypesExceptNode(): Type[];
    typesToProcess(): Type[];
    enumsToProcess(): Enum[];
    writeTypes(): void;
    writeWrappedTypes(): void;
    writeEnums(): void;
    writeUtilsEnums(): void;
    writeAstHelpers(): void;
    writeRuntimeSchema(): void;
    getRuntimeSchema(): any[];
    isWrappedType(typeName: string): boolean;
    generateRuntimeSchemaTypeScript(nodeSpecs: any[]): string;
    getHeader(): string;
    writeFile(filename: string, content: string): void;
    writeCodeToFile(filename: string, nodes: t.Node[]): void;
}
export {};
