import generate from '@babel/generator';
import * as t from '@babel/types';

export const convertAstToCode = (body: any[]) => {
  const ast = t.file(t.program(body));
  // @ts-ignore
  const { code } = generate(ast);
  return code;
};

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

export const createNamedImportAsSuffix = (importNames: string[], source: string, suffix: string) => {
  const specifiers = importNames.map(name =>
    t.importSpecifier(t.identifier(name + suffix), t.identifier(name))
  );
  return t.importDeclaration(specifiers, t.stringLiteral(source));
};
