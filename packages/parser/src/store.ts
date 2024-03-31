import { Service, Type, Field, Enum, Namespace, ReflectionObject } from '@launchql/protobufjs';
import { generateTSInterfaces, buildEnumNamedImports, createAstHelperMethodsAST, generateImportSpecifiersAST, buildEnumValueFunctionAST, transformEnumToTypeUnionAST, transformEnumToAST } from './ast';
import { generateEnum2IntJSON, generateEnum2StrJSON } from './ast/enums/enums-json';
import { sync as mkdirp } from 'mkdirp';
import { join } from 'path';
import { defaultPgProtoParserOptions, getOptionsWithDefaults, PgProtoStoreOptions } from './options';
import { cloneAndNameNode, convertAstToCode, createDefaultImport, getUndefinedKey, hasUndefinedInitialValue, stripExtension, writeFileToDisk } from './utils';
import { nestedObjCode } from './inline-helpers';

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

  writeTypes() {
    if (this.options.types.enabled) {
      const code = convertAstToCode([
        buildEnumNamedImports(this.enums, this.options.types.enumsSource),
        ...generateTSInterfaces(this.types, this.options, this.options.types.wrapped)
      ]);
      this.writeFile(this.options.types.filename, code);
    }
  }

  writeEnums() {
    if (this.options.enums.enabled) {
      const code = convertAstToCode(
        this.enums.map(enm => this.options.enums.enumsAsTypeUnion ?
          transformEnumToTypeUnionAST(enm) :
          transformEnumToAST(enm)
        )
      );
      this.writeFile(this.options.enums.filename, code);
    }
  }

  writeUtilsEnums() {
    if (this.options.utils.enums.enabled) {
      const code = convertAstToCode(buildEnumValueFunctionAST(this.enums));
      this.writeFile(this.options.utils.enums.filename, code);
    }
  }

  writeAstHelpers() {
    if (this.options.utils.astHelpers.enabled) {
      const imports = this.options.utils.astHelpers.inlineNestedObj ?
        createDefaultImport('_o', './' + stripExtension(this.options.utils.astHelpers.nestedObjFile)) :
        createDefaultImport('_o', 'nested-obj');

      const code = convertAstToCode([
        imports,
        generateImportSpecifiersAST(this.types, this.options),
        createAstHelperMethodsAST(this.types)
      ]);

      this.writeFile(this.options.utils.astHelpers.filename, code);

      if (this.options.utils.astHelpers.inlineNestedObj) {
        this.writeFile(this.options.utils.astHelpers.nestedObjFile, nestedObjCode);
      }
    }
  }

  writeFile (filename: string, content: string) {
    const file = join(this.options.outDir, filename);
    writeFileToDisk(file, content, this.options);
  }

}

