import { Type, Enum } from '@launchql/protobufjs';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { PgProtoParserOptions } from '../options';
import { createAstHelperMethodsAST, createUnionTypeAST, transformTypeToAST } from './types';
import { buildEnumValueFunctionAST, transformEnumToAST, transformEnumToTypeUnionAST } from './enums';
import { stripExtension } from '../utils';

export const generateImportSpecifiersAST = (types: Type[], options: PgProtoParserOptions) => {
  const importSpecifiers = types.map(type =>
    t.importSpecifier(t.identifier(type.name), t.identifier(type.name))
  );

  const importDeclaration = t.importDeclaration(importSpecifiers, t.stringLiteral(options.utils.astHelpers.typeSource));
  return importDeclaration;
}

export const createDefaultImport = (importName: string, source: string) => {
  return t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(importName))],
    t.stringLiteral(source)
  );
};

export const createNamedImport = (importNames: string[], source: string) => {
  const specifiers = importNames.map(name => 
    t.importSpecifier(t.identifier(name), t.identifier(name))
  );
  return t.importDeclaration(specifiers, t.stringLiteral(source));
};

export const generateTSInterfaces = (
  types: Type[],
  options: PgProtoParserOptions,
  useNestedTypes: boolean
) => {
  const node = createUnionTypeAST(types.filter(type => type.name !== 'Node'));
  const typeDefns = types.reduce((m, type) => {
    if (type.name === 'Node') return m;
    return [...m, transformTypeToAST(type, options, useNestedTypes)]
  }, []);

  const ast = t.file(t.program(
    [
      node,
      ...typeDefns
    ]
  ));
  const { code } = generate(ast);
  return code;
}

export const generateTSEnums = (enums: Enum[]) => {
  const ast = t.file(t.program(enums.map(enm => transformEnumToAST(enm))));
  const { code } = generate(ast);
  return code;
}

export const generateTSEnumsTypeUnionAST = (enums: Enum[]) => {
  const ast = t.file(t.program(enums.map(enm => transformEnumToTypeUnionAST(enm))));
  const { code } = generate(ast);
  return code;
}

export const generateTSEnumFunction = (enums: Enum[]) => {
  const ast = t.file(t.program(buildEnumValueFunctionAST(enums)));
  const { code } = generate(ast);
  return code;
}
export const generateTSASTHelperMethods = (types: Type[]) => {
  const ast = t.file(t.program([
    createAstHelperMethodsAST(types)
  ]));
  const { code } = generate(ast);
  return code;
}

export const generateTSASTHelpersImports = (types: Type[], options: PgProtoParserOptions) => {
  const ast = t.file(t.program([
    options.utils.astHelpers.inlineNestedObj ?
    createDefaultImport('_o', './' + stripExtension(options.utils.astHelpers.nestedObjFile)) :
    createDefaultImport('_o', 'nested-obj'),
    generateImportSpecifiersAST(types, options)
  ]));
  const { code } = generate(ast);
  return code;
};