import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { generateTSEnums, generateTSInterfaces, generateTSEnumFunction } from './ast';
import { generateEnum2IntJSON, generateEnum2StrJSON } from './json';
import { sync as mkdirp } from 'mkdirp';
import { writeFileSync } from 'fs';
import { defaultPgProtoParserOptions, PgProtoStoreOptions } from './types';
import { getUndefinedKey, hasUndefinedInitialValue } from './utils';

const cloneAndNameNode = (node: ReflectionObject, name: string) => {
  const clone = JSON.parse(JSON.stringify(node));
  return {
    name,
    ...clone
  }
}

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
export class ProtoStore implements IProtoStore {
  options: PgProtoStoreOptions;
  root: ReflectionObject;
  services: Service[];
  types: Type[];
  fields: Field[];
  enums: Enum[];
  namespaces: Namespace[];

  constructor(
    root: ReflectionObject,
    options: PgProtoStoreOptions = {} as PgProtoStoreOptions
  ) {
    this.options = {
      includeEnumsJSON: defaultPgProtoParserOptions.includeEnumsJSON,
      includeTypes: defaultPgProtoParserOptions.includeTypes,
      includeUtils: defaultPgProtoParserOptions.includeUtils,
      outDir: defaultPgProtoParserOptions.outDir,
      ...options
    };

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
      this.enums.push(cloneAndNameNode(this._processEnum(node), name));
    }

    if (node instanceof Namespace) {
      this.namespaces.push(node);
      Object.entries(node.nested || {}).forEach(([key, child]) => {
        this._parse(child, key);
      });
    }
  }

  _processEnum(enumNode: Enum): Enum {
    const undefinedKey = getUndefinedKey(enumNode.name);
    const clone = cloneAndNameNode(enumNode, enumNode.name);
    if (!this.options.removeUndefinedAt0 || !hasUndefinedInitialValue(enumNode)) {
      return clone;
    }

    const newValues = {};
    let decrement = 0;

    for (const [key, value] of Object.entries(enumNode.values)) {
        if (key.endsWith('_UNDEFINED') && value === 0) {
            decrement = 1;
            continue;
        }
        newValues[key] = value - decrement;
    }

    clone.values = newValues;
    return clone;

    
}

  write() {
    // Ensure the output directory exists
    mkdirp(this.options.outDir);

    if (this.options.includeEnumsJSON) {
      const enums2int = generateEnum2IntJSON(this.enums);
      const enums2str = generateEnum2StrJSON(this.enums);

      // Write the files
      writeFileSync(`${this.options.outDir}/enums2int.json`, JSON.stringify(enums2int, null, 2));
      writeFileSync(`${this.options.outDir}/enums2str.json`, JSON.stringify(enums2str, null, 2));
    }

    if (this.options.includeTypes) {
      const typesTS = generateTSInterfaces(this.types);
      const enumsTS = generateTSEnums(this.enums);

      // Write the files
      writeFileSync(`${this.options.outDir}/types.ts`, `${enumsTS}\n${typesTS}`);
    }

    if (this.options.includeUtils) {
      const utilsTS = generateTSEnumFunction(this.enums);

      // Write the files
      writeFileSync(`${this.options.outDir}/utils.ts`, utilsTS);
    }
  }

}

