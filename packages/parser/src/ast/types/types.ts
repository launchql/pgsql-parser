import { Type, Field } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { getFieldName, toSpecialCamelCase } from '../../utils';
import { PgProtoParserOptions } from '../../options';
import { SPECIAL_TYPES } from '../../constants';
import { resolveTypeName } from './utils';

export const createAstHelperMethodsAST = (types: Type[]): t.ExportDefaultDeclaration => {
  const creators = types.filter(type => type.name !== 'Node').map((type: Type) => {
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
export const createUnionTypeAST = (types: Type[]) => {
  const unionTypeNames = types.map(type => t.tsTypeReference(t.identifier(type.name)));

  const unionTypeAlias = t.tsTypeAliasDeclaration(
    t.identifier('Node'),
    null,
    t.tsUnionType(unionTypeNames)
  );

  return t.exportNamedDeclaration(unionTypeAlias, []);
};

export const transformTypeToAST = (
  type: Type,
  options: PgProtoParserOptions,
  useNestedTypes: boolean
) => {
  const typeName = type.name;
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


  const nestedType = t.tsTypeLiteral(properties);
  const nestedProperty = t.tsPropertySignature(
    t.identifier(typeName),
    t.tsTypeAnnotation(nestedType)
  );


  let body = [];
  if (useNestedTypes && !SPECIAL_TYPES.includes(typeName)) {
    body = [nestedProperty];
  } else {
    body = properties;
  }

  const interfaceDecl = t.tsInterfaceDeclaration(
    t.identifier(typeName),
    null,
    [],
    t.tsInterfaceBody(body)
  );

  // Wrap the interface declaration in an export statement
  return t.exportNamedDeclaration(interfaceDecl, []);
}
