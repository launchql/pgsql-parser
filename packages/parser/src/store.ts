import { Service, Type, Field, Enum, Root, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { generateTSEnums, generateTSInterfaces, generateTSEnumFunction } from './ast';
import { generateEnum2IntJSON, generateEnum2StrJSON  } from './json';

interface IProtoStore {
    root: ReflectionObject;

    services: Service[];
    types: Type[];
    fields: Field[];
    enums: Enum[];
    namespaces: Namespace[];

    _parse(node: ReflectionObject): void;
}

const cloneAndNameNode = (node: ReflectionObject, name: string) => {
    const clone = JSON.parse(JSON.stringify(node));
    return {
        name,
        ...clone
    }
}

export class ProtoStore implements IProtoStore {
    root: ReflectionObject;

    services: Service[];
    types: Type[];
    fields: Field[];
    enums: Enum[];
    namespaces: Namespace[];

    constructor(root: ReflectionObject) {
        this.root = root;
        this.services = [];
        this.types = [];
        this.fields = [];
        this.enums = [];
        this.namespaces = [];

        this._parse(this.root);
    }

    _parse(node: ReflectionObject, name: string = '') {
        if (node instanceof Service) {
            this.services.push(cloneAndNameNode(node, name));
        } else if (node instanceof Type) {
            this.types.push(cloneAndNameNode(node, name));
            node.fieldsArray.forEach(field => this.fields.push(field));
        } else if (node instanceof Enum) {
            this.enums.push(cloneAndNameNode(node, name));
        }

        if (node instanceof Namespace) {
            this.namespaces.push(node);
            Object.entries(node.nested || {}).forEach(([key, child]) => {
                this._parse(child, key);
            });
        }
    }

    print() {
        return this.printEnums() + '\n' +
            this.printInterfaces()
    }

    printEnum2IntJSON() {
        return generateEnum2IntJSON(this.enums);
    }

    printEnum2StrJSON() {
        return generateEnum2StrJSON(this.enums);
    }

    printInterfaces() {
        return generateTSInterfaces(this.types);
    }

    printEnums() {
        return generateTSEnums(this.enums);
    }

    printEnumsFn() {
        return generateTSEnumFunction(this.enums);
    }

}

