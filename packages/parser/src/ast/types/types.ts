import { Type, Field } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { createNamedImport, createNamedImportAsSuffix, getFieldName, toSpecialCamelCase } from '../../utils';
import { PgProtoParserOptions } from '../../options';
import { SPECIAL_TYPES } from '../../constants';
import { resolveTypeName } from './utils';

export const buildTypeNamedImports = (types: Type[], source: string, suffix?: string) => {
  return suffix ?
    createNamedImportAsSuffix(types.map(e => e.name), source, suffix) :
    createNamedImport(types.map(e => e.name), source);
};

export const createAstHelperMethodsAST = (types: Type[]): t.ExportDefaultDeclaration => {
  const creators = types.map((type: Type) => {
    const typeName = type.name;
    const param = t.identifier('_p');
    param.optional = true;


    if (!SPECIAL_TYPES.includes(type.name)) {
      param.typeAnnotation = t.tsTypeAnnotation(
        t.tsIndexedAccessType(
          t.tsTypeReference(t.identifier(typeName)),
          t.tsLiteralType(t.stringLiteral(typeName))
        )
      );
    } else {
      param.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));
    }

    let init: any = [t.objectProperty(t.identifier(typeName), t.objectExpression([]))];
    if (SPECIAL_TYPES.includes(typeName)) {
      init = [];
    }

    // @ts-ignore
    const fields: Field[] = type.fields;
    const astNodeInit = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier('_j'),
        t.tsAsExpression(
          t.objectExpression(init),
          t.tsTypeReference(t.identifier(typeName))
        )
      )
    ]);

    const setStatements = Object.entries(fields)
      .map(([fName, field]) => {
        const fieldName = getFieldName(field, fName);
        return t.expressionStatement(
          t.callExpression(
            t.memberExpression(t.identifier('_o'), t.identifier('set')),
            [
              t.identifier('_j'),
              t.stringLiteral(SPECIAL_TYPES.includes(typeName) ? fieldName : `${typeName}.${fieldName}`),
              t.optionalMemberExpression(
                t.identifier('_p'),
                t.identifier(fieldName),
                false,
                true
              )
            ]
          )
        );
      });

    // Ensures camel case
    const methodName = toSpecialCamelCase(typeName);

    // Create the method
    const method = t.objectMethod(
      'method',
      t.identifier(methodName),
      [param],
      t.blockStatement([
        astNodeInit,
        ...setStatements,
        t.returnStatement(t.identifier('_j'))
      ])
    );

    method.returnType = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));
    return method;
  });

  return t.exportDefaultDeclaration(t.objectExpression(creators));
}

// special for Node
export const createNodeUnionTypeAST = (types: Type[]) => {
  const unionTypeNames = types.map(type => t.tsTypeReference(t.identifier(type.name)));

  const unionTypeAlias = t.tsTypeAliasDeclaration(
    t.identifier('Node'),
    null,
    t.tsUnionType(unionTypeNames)
  );

  return t.exportNamedDeclaration(unionTypeAlias, []);
};

const getTypeFieldsAsTS = (
  type: Type,
  options: PgProtoParserOptions
) => {

  // @ts-ignore
  const fields: Field[] = type.fields;
  const properties =
    Object.entries(fields)
      .map(([fieldName, field]) => {
        const type = resolveTypeName(field.type);
        const fieldType = field.rule === 'repeated' ?
          t.tsArrayType(type) :
          type;
        const prop = t.tsPropertySignature(
          t.identifier(getFieldName(field, fieldName)),
          t.tsTypeAnnotation(fieldType)
        );
        prop.optional = options.types.optionalFields;
        return prop;
      });

  return properties;
}

export const transformTypeToTSInterface = (
  type: Type,
  options: PgProtoParserOptions
) => {
  const typeName = type.name;
  const properties = getTypeFieldsAsTS(type, options);

  const interfaceDecl = t.tsInterfaceDeclaration(
    t.identifier(typeName),
    null,
    [],
    t.tsInterfaceBody(properties)
  );

  // Wrap the interface declaration in an export statement
  return t.exportNamedDeclaration(interfaceDecl, []);
}
export const transformTypeToTSWrappedInterface = (
  type: Type,
  options: PgProtoParserOptions
) => {
  const typeName = type.name;
  if (SPECIAL_TYPES.includes(typeName)) return transformTypeToTSInterface(type, options);

  const properties = getTypeFieldsAsTS(type, options);

  const nestedInterfaceBody = t.tsInterfaceBody([
    t.tsPropertySignature(
      t.identifier(typeName),
      t.tsTypeAnnotation(t.tsTypeLiteral(properties))
    )
  ]);

  const interfaceDecl = t.tsInterfaceDeclaration(
    t.identifier(typeName),
    null,
    [],
    nestedInterfaceBody
  );

  return t.exportNamedDeclaration(interfaceDecl, []);
};

export const generateImportSpecifiersAST = (types: Type[], options: PgProtoParserOptions) => {
  const importSpecifiers = types.map(type =>
    t.importSpecifier(t.identifier(type.name), t.identifier(type.name))
  );

  const importDeclaration = t.importDeclaration(importSpecifiers, t.stringLiteral(options.utils.astHelpers.wrappedTypesSource));
  return importDeclaration;
}