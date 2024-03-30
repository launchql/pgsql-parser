import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
interface IProtoStore {
    outputDir: string;
    root: ReflectionObject;
    services: Service[];
    types: Type[];
    fields: Field[];
    enums: Enum[];
    namespaces: Namespace[];
    _parse(node: ReflectionObject): void;
}
export declare class ProtoStore implements IProtoStore {
    outputDir: string;
    root: ReflectionObject;
    services: Service[];
    types: Type[];
    fields: Field[];
    enums: Enum[];
    namespaces: Namespace[];
    constructor(root: ReflectionObject, outDir?: string);
    _parse(node: ReflectionObject, name?: string): void;
    write(): void;
}
export {};
