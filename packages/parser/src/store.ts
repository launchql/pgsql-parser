import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { generateEnumImports, generateAstHelperMethods, generateTypeImportSpecifiers, generateEnumValueFunctions, convertEnumToTsUnionType, convertEnumToTsEnumDeclaration, generateNodeUnionType, convertTypeToTsInterface, convertTypeToWrappedTsInterface } from './ast';
import { RuntimeSchemaGenerator } from './runtime-schema';
import { generateEnum2IntJSON, generateEnum2StrJSON } from './ast/enums/enums-json';
import { sync as mkdirp } from 'mkdirp';
import { join } from 'path';
import { getOptionsWithDefaults, PgProtoStoreOptions } from './options';
import { cloneAndNameNode, convertAstToCode, createDefaultImport, getUndefinedKey, hasUndefinedInitialValue, stripExtension, writeFileToDisk } from './utils';
import { nestedObjCode } from './inline-helpers';
import * as t from '@babel/types';
import { NODE_TYPE } from './constants';

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
  private _runtimeSchema?: any[];

  constructor(
    root: ReflectionObject,
    options: PgProtoStoreOptions = {} as PgProtoStoreOptions
  ) {
    this.options = getOptionsWithDefaults(options);

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
    if (!this.options.enums.removeUndefinedAt0 || !hasUndefinedInitialValue(enumNode)) {
      return clone;
    }

    const newValues = {};
    let decrement = 0;

    for (const [key, value] of Object.entries(enumNode.values)) {
      if (key === undefinedKey && value === 0) {
        decrement = 1;
        continue;
      }
      newValues[key] = (value as number) - decrement;
    }

    clone.values = newValues;
    return clone;
  }

  write() {
    // Ensure the output directory exists
    mkdirp(this.options.outDir);

    this.writeEnumsJSON();
    this.writeTypes();
    this.writeWrappedTypes();
    this.writeEnums();
    this.writeUtilsEnums();
    this.writeAstHelpers();
    this.writeRuntimeSchema();
  }

  writeEnumsJSON() {
    if (this.options.enums.json.enabled) {
      const enums2int = generateEnum2IntJSON(this.enums);
      const enums2str = generateEnum2StrJSON(this.enums);

      this.writeFile(this.options.enums.json.toIntOutFile, JSON.stringify(enums2int, null, 2));
      this.writeFile(this.options.enums.json.toStrOutFile, JSON.stringify(enums2str, null, 2));
    }
  }

  allTypesExceptNode () {
    return this.types.filter(type => type.name !== NODE_TYPE);
  }

  typesToProcess () {
    return this.types
      .filter(type => type.name !== NODE_TYPE)
      .filter(type => !this.options.exclude.includes(type.name));
  }

  enumsToProcess () {
    return this.enums
      .filter(enm => !this.options.exclude.includes(enm.name));
  }

  writeTypes() {
    if (this.options.types.enabled) {
      const typesToProcess = this.typesToProcess();
      const enumsToProcess = this.enumsToProcess();
      const node = generateNodeUnionType(this.options, typesToProcess);
      const enumImports = generateEnumImports(enumsToProcess, this.options.types.enumsSource);
      const types = typesToProcess.reduce((m, type) => {
        return [...m, convertTypeToTsInterface(type, this.options)]
      }, []);
      this.writeCodeToFile(this.options.types.filename, [
        enumImports,
        node,
        ...types
      ]);
    }
  }

  writeWrappedTypes() {
    if (this.options.types.wrapped.enabled) {
      const typesToProcess = this.typesToProcess();
      const enumImports = generateEnumImports(
        this.enumsToProcess(),
        this.options.types.wrapped.enumsSource
      );
      const node = generateNodeUnionType(this.options, typesToProcess);
      const types = typesToProcess.reduce((m, type) => {
        return [...m, convertTypeToWrappedTsInterface(type, this.options, (typeName: string) => this.isWrappedType(typeName))]
      }, []);
      this.writeCodeToFile(this.options.types.wrapped.filename, [
        enumImports,
        node,
        ...types
      ]);
    }
  }

  writeEnums() {
    if (this.options.enums.enabled) {
      this.writeCodeToFile(this.options.enums.filename, 
        this.enumsToProcess().map(enm => this.options.enums.enumsAsTypeUnion ?
          convertEnumToTsUnionType(enm) :
          convertEnumToTsEnumDeclaration(enm)
        )
      );
    }
  }

  writeUtilsEnums() {
    if (this.options.utils.enums.enabled) {
      const code = convertAstToCode(generateEnumValueFunctions(this.enumsToProcess()));
      this.writeFile(this.options.utils.enums.filename, code);
    }
  }

  writeAstHelpers() {
    if (this.options.utils.astHelpers.enabled) {
      const imports = this.options.utils.astHelpers.inlineNestedObj ?
        createDefaultImport('_o', './' + stripExtension(this.options.utils.astHelpers.nestedObjFile)) :
        createDefaultImport('_o', 'nested-obj');

      const typesToProcess = this.typesToProcess();
      const code = convertAstToCode([
        imports,
        generateTypeImportSpecifiers(typesToProcess, this.options),
        generateAstHelperMethods(typesToProcess, (typeName: string) => this.isWrappedType(typeName))
      ]);

      this.writeFile(this.options.utils.astHelpers.filename, code);

      if (this.options.utils.astHelpers.inlineNestedObj) {
        this.writeFile(this.options.utils.astHelpers.nestedObjFile, nestedObjCode);
      }
    }
  }

  writeRuntimeSchema() {
    if (!this.options.runtimeSchema?.enabled) {
      return;
    }

    const generator = new RuntimeSchemaGenerator(this.root as Namespace);
    const nodeSpecs = generator.generateNodeSpecs();
    const format = this.options.runtimeSchema.format || 'json';
    const filename = this.options.runtimeSchema.filename || 'runtime-schema';

    if (format === 'json') {
      const jsonContent = JSON.stringify(nodeSpecs, null, 2);
      const outFile = join(this.options.outDir, `${filename}.json`);
      writeFileToDisk(outFile, jsonContent, this.options);
    } else if (format === 'typescript') {
      const tsContent = this.generateRuntimeSchemaTypeScript(nodeSpecs);
      const outFile = join(this.options.outDir, `${filename}.ts`);
      writeFileToDisk(outFile, tsContent, this.options);
    }
  }

  getRuntimeSchema() {
    if (!this._runtimeSchema) {
      const generator = new RuntimeSchemaGenerator(this.root as Namespace);
      this._runtimeSchema = generator.generateNodeSpecs();
    }
    return this._runtimeSchema;
  }

  isWrappedType(typeName: string): boolean {
    const schema = this.getRuntimeSchema();
    const nodeSpec = schema.find(spec => spec.name === typeName);
    return nodeSpec ? nodeSpec.wrapped : false;
  }

  generateRuntimeSchemaTypeScript(nodeSpecs: any[]): string {
    const interfaceDefinitions = [
      'export interface FieldSpec {',
      '  name: string;',
      '  type: string;',
      '  isNode: boolean;',
      '  isArray: boolean;',
      '  optional: boolean;',
      '}',
      '',
      'export interface NodeSpec {',
      '  name: string;',
      '  wrapped: boolean;',
      '  fields: FieldSpec[];',
      '}',
      ''
    ];

    const exportStatement = `export const runtimeSchema: NodeSpec[] = ${JSON.stringify(nodeSpecs, null, 2)};`;

    return [
      this.options.includeHeader ? this.getHeader() : '',
      ...interfaceDefinitions,
      exportStatement
    ].filter(Boolean).join('\n');
  }

  getHeader(): string {
    return `// Generated by pg-proto-parser`;
  }

  writeFile(filename: string, content: string) {
    const file = join(this.options.outDir, filename);
    writeFileToDisk(file, content, this.options);
  }

  writeCodeToFile(filename: string, nodes: t.Node[]) {
    const code = convertAstToCode(nodes);
    const filePath = join(this.options.outDir, filename);
    writeFileToDisk(filePath, code, this.options);
  }

}

