import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { generateTSEnums, generateTSInterfaces, generateTSEnumFunction } from './ast';
import { generateEnum2IntJSON, generateEnum2StrJSON } from './json';
import { sync as mkdirp } from 'mkdirp';
import { writeFileSync } from 'fs';

const cloneAndNameNode = (node: ReflectionObject, name: string) => {
  const clone = JSON.parse(JSON.stringify(node));
  return {
    name,
    ...clone
  }
}
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
export class ProtoStore implements IProtoStore {
  outputDir: string;
  root: ReflectionObject;
  services: Service[];
  types: Type[];
  fields: Field[];
  enums: Enum[];
  namespaces: Namespace[];

  constructor(
    root: ReflectionObject,
    outDir: string = `${process.cwd()}/out`
  ) {
    this.outputDir = outDir;
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

  write() {
    // Ensure the output directory exists
    mkdirp(this.outputDir);

    const enums2int = generateEnum2IntJSON(this.enums);
    const enums2str = generateEnum2StrJSON(this.enums);
    const typesTS = generateTSInterfaces(this.types);
    const enumsTS = generateTSEnums(this.enums);
    const utilsTS = generateTSEnumFunction(this.enums);

    // Write the files
    writeFileSync(`${this.outputDir}/enums2int.json`, JSON.stringify(enums2int, null, 2));
    writeFileSync(`${this.outputDir}/enums2str.json`, JSON.stringify(enums2str, null, 2));
    writeFileSync(`${this.outputDir}/types.ts`, `${enumsTS}\n${typesTS}`);
    writeFileSync(`${this.outputDir}/utils.ts`, utilsTS);
  }

}

