import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { buildEnumNamedImports, createAstHelperMethodsAST, generateImportSpecifiersAST, buildEnumValueFunctionAST, transformEnumToTypeUnionAST, transformEnumToAST, createNodeUnionTypeAST, buildTypeNamedImports, transformTypeToTSInterface, transformTypeToTSWrappedInterface } from './ast';
import { generateEnum2IntJSON, generateEnum2StrJSON } from './ast/enums/enums-json';
import { sync as mkdirp } from 'mkdirp';
import { join } from 'path';
import { defaultPgProtoParserOptions, getOptionsWithDefaults, PgProtoStoreOptions } from './options';
import { cloneAndNameNode, convertAstToCode, createDefaultImport, getUndefinedKey, hasUndefinedInitialValue, stripExtension, writeFileToDisk } from './utils';
import { nestedObjCode } from './inline-helpers';
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
      newValues[key] = value - decrement;
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
    return this.types.filter(type => type.name !== 'Node');
  }

  typesToProcess () {
    return this.types
      .filter(type => type.name !== 'Node')
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
      const node = createNodeUnionTypeAST(typesToProcess);
      const enumImports = buildEnumNamedImports(enumsToProcess, this.options.types.enumsSource);
      const types = typesToProcess.reduce((m, type) => {
        return [...m, transformTypeToTSInterface(type, this.options)]
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
      const enumImports = buildEnumNamedImports(
        this.enumsToProcess(),
        this.options.types.wrapped.enumsSource
      );
      const node = createNodeUnionTypeAST(typesToProcess);
      const types = typesToProcess.reduce((m, type) => {
        return [...m, transformTypeToTSWrappedInterface(type, this.options)]
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
          transformEnumToTypeUnionAST(enm) :
          transformEnumToAST(enm)
        )
      );
    }
  }

  writeUtilsEnums() {
    if (this.options.utils.enums.enabled) {
      const code = convertAstToCode(buildEnumValueFunctionAST(this.enumsToProcess()));
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
        generateImportSpecifiersAST(typesToProcess, this.options),
        createAstHelperMethodsAST(typesToProcess)
      ]);

      this.writeFile(this.options.utils.astHelpers.filename, code);

      if (this.options.utils.astHelpers.inlineNestedObj) {
        this.writeFile(this.options.utils.astHelpers.nestedObjFile, nestedObjCode);
      }
    }
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

