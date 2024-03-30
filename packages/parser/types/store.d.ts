import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { PgProtoStoreOptions } from './types';
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
    constructor(root: ReflectionObject, options?: PgProtoStoreOptions);
    _parse(node: ReflectionObject, name?: string): void;
    _processEnum(enumNode: Enum): Enum;
    write(): void;
    writeFile(filename: string, content: string): void;
}
export {};
