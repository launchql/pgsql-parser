import { Type, Field } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { createNamedImport, createNamedImportAsSuffix, getFieldName, toSpecialCamelCase } from '../../utils';
import { PgProtoParserOptions } from '../../options';
import { NODE_TYPE } from '../../constants';
import { resolveTypeName } from './utils';

export const generateTypeImports = (types: Type[], source: string, suffix?: string) => {
  return suffix ?
    createNamedImportAsSuffix(types.map(e => e.name), source, suffix) :
    createNamedImport(types.map(e => e.name), source);
};

export const generateAstHelperMethods = (types: Type[]): t.ExportDefaultDeclaration => {
  const creators = types.map((type: Type) => {
    const typeName = type.name;
    const param = t.identifier('_p');
    param.optional = true;

    param.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));

    let init: any = [];

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
              t.stringLiteral(fieldName),
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
export const generateNodeUnionType = (
  options: PgProtoParserOptions,
  types: Type[]
) => {
  if (options.types.wrappedNodeTypeExport) {
    return generateNodeUnionTypeObjectKeys(types);
  }
  const unionTypeNames = types.map(type => t.tsTypeReference(t.identifier(type.name)));

  const unionTypeAlias = t.tsTypeAliasDeclaration(
    t.identifier(NODE_TYPE),
    null,
    t.tsUnionType(unionTypeNames)
  );

  return t.exportNamedDeclaration(unionTypeAlias, []);
};


export const generateNodeUnionTypeObjectKeys = (types: Type[]) => {
  // Mapping types to TypeScript object type annotations
  const unionTypeNames = types.map(type => 
    t.tsTypeLiteral([
      t.tsPropertySignature(
        t.identifier(type.name),
        t.tsTypeAnnotation(t.tsTypeReference(t.identifier(type.name)))
      )
    ])
  );

  // Creating the TypeScript union type
  const unionTypeAlias = t.tsTypeAliasDeclaration(
    t.identifier(NODE_TYPE),
    null,
    t.tsUnionType(unionTypeNames)
  );

  // Exporting the union type declaration
  return t.exportNamedDeclaration(unionTypeAlias, []);
};




// TODO: why is the Field.rule missing in types, but there in the JSON?
interface FieldType extends Field {
  rule: string;
}

const extractTypeFieldsAsTsProperties = (
  type: Type,
  options: PgProtoParserOptions
) => {

  // @ts-ignore
  const fields: FieldType[] = type.fields;
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

export const convertTypeToTsInterface = (
  type: Type,
  options: PgProtoParserOptions
) => {
  const typeName = type.name;
  const properties = extractTypeFieldsAsTsProperties(type, options);

  const interfaceDecl = t.tsInterfaceDeclaration(
    t.identifier(typeName),
    null,
    [],
    t.tsInterfaceBody(properties)
  );

  // Wrap the interface declaration in an export statement
  return t.exportNamedDeclaration(interfaceDecl, []);
}
export const convertTypeToWrappedTsInterface = (
  type: Type,
  options: PgProtoParserOptions,
  isWrappedTypeFn: (typeName: string) => boolean
) => {
  const typeName = type.name;
  // if (!isWrappedTypeFn(typeName)) return convertTypeToTsInterface(type, options);
  return convertTypeToTsInterface(type, options);

  // TODO bring this back to life...

  // const properties = extractTypeFieldsAsTsProperties(type, options);

  // const nestedInterfaceBody = t.tsInterfaceBody([
  //   t.tsPropertySignature(
  //     t.identifier(typeName),
  //     t.tsTypeAnnotation(t.tsTypeLiteral(properties))
  //   )
  // ]);

  // const interfaceDecl = t.tsInterfaceDeclaration(
  //   t.identifier(typeName),
  //   null,
  //   [],
  //   nestedInterfaceBody
  // );

  // return t.exportNamedDeclaration(interfaceDecl, []);
};

export const generateTypeImportSpecifiers = (types: Type[], options: PgProtoParserOptions) => {
  const importSpecifiers = types.map(type =>
    t.importSpecifier(t.identifier(type.name), t.identifier(type.name))
  );

  const importDeclaration = t.importDeclaration(importSpecifiers, t.stringLiteral(options.utils.astHelpers.wrappedTypesSource));
  return importDeclaration;
}
