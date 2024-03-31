import { Type, Field } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { getFieldName, toSpecialCamelCase } from '../../utils';
import { PgProtoParserOptions } from '../../types';
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


    // @ts-ignore
    const fields: Field[] = type.fields;
    const properties = Object.entries(fields)
      .map(([fieldName, field]) => {
        return t.objectProperty(
          t.identifier(getFieldName(field, fieldName)),
          t.optionalMemberExpression(
            t.identifier('_p'),
            t.identifier(getFieldName(field, fieldName)),
            false,
            true // OPTIONAL
          ),
          false,
          true
        );
      });

    // Get method body
    let body = t.objectExpression([
      ...properties
    ]);

    if (!SPECIAL_TYPES.includes(type.name)) {
      body = t.objectExpression([
        t.objectProperty(t.identifier(type.name), body)
      ]);
    }

    // Ensures camel case
    const methodName = toSpecialCamelCase(typeName);

    // Create the method
    const method = t.objectMethod(
      'method',
      t.identifier(methodName),
      [param],
      t.blockStatement([
        t.returnStatement(
          body
        )
      ])
    );

    method.returnType = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));
    // if (SPECIAL_TYPES.includes(typeName)) {
    //   method.returnType = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));
    // } else {
    //   method.returnType =
    //     t.tsTypeAnnotation(
    //       t.tsTypeLiteral([
    //         t.tsPropertySignature(
    //           t.identifier(typeName),
    //           t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)))
    //         )
    //       ])
    //     );
    // }


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
        prop.optional = options.optionalFields;
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
