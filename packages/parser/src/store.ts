import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { generateTSEnums, generateTSInterfaces, generateTSEnumFunction, generateTSEnumsTypeUnionAST, generateTSASTHelpersImports, generateTSASTHelperMethods } from './ast';
import { generateEnum2IntJSON, generateEnum2StrJSON } from './json';
import { sync as mkdirp } from 'mkdirp';
import { defaultPgProtoParserOptions, PgProtoStoreOptions } from './types';
import { cloneAndNameNode, getUndefinedKey, hasUndefinedInitialValue, writeFileToDisk } from './utils';

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
      includeEnumTypeUnion: defaultPgProtoParserOptions.includeEnumTypeUnion,
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
        if (key === undefinedKey && value === 0) {
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
      this.writeFile(`${this.options.outDir}/enums2int.json`, JSON.stringify(enums2int, null, 2));
      this.writeFile(`${this.options.outDir}/enums2str.json`, JSON.stringify(enums2str, null, 2));
    }

    if (this.options.includeTypes) {
      // TODO
      // TODO
      // TODO
      // TODO
      // - [ ] split into files — move union and/or enums into another files
      const wrapped = generateTSInterfaces(this.types, this.options, true);
      const typesTS = generateTSInterfaces(this.types, this.options, false);
      let enumsTS = '';

      if (this.options.includeEnumTypeUnion) {
        enumsTS = generateTSEnumsTypeUnionAST(this.enums);
      } else {
        enumsTS = generateTSEnums(this.enums);
      }

      // Write the files
      this.writeFile(`${this.options.outDir}/types.ts`, [enumsTS, typesTS].join('\n'));
      this.writeFile(`${this.options.outDir}/wrapped.ts`, [enumsTS, wrapped].join('\n'));
    }

    if (this.options.includeEnums) {
      const enumsTS = generateTSEnums(this.enums);
      // Write the files
      this.writeFile(`${this.options.outDir}/enums.ts`, enumsTS);
    }

    if (this.options.includeUtils) {
      const utilsTS = generateTSEnumFunction(this.enums);

      // Write the files
      this.writeFile(`${this.options.outDir}/utils.ts`, utilsTS);
    }

    if (this.options.includeAstHelpers) {
      const imports = generateTSASTHelpersImports(this.types, this.options);
      const astsTS = generateTSASTHelperMethods(this.types);

      // Write the files
      this.writeFile(`${this.options.outDir}/asts.ts`, [imports, astsTS].join('\n'));
    }
  }
  writeFile (filename: string, content: string) {
    writeFileToDisk(filename, content, this.options);
  }

}

