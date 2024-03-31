import * as t from '@babel/types';

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
