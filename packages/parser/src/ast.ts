import { Service, Type, Field, Enum, Root, Namespace, ReflectionObject } from '@launchql/protobufjs';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { getFieldName } from './utils';

export const getTSType = (type: string) => {
  switch (type) {
    case 'string':
      return t.tsStringKeyword();
    case 'double':
    case 'float':
    case 'int32':
    case 'uint32':
    case 'sint32':
    case 'fixed32':
    case 'sfixed32':
      return t.tsNumberKeyword();
    case 'int64':
    case 'uint64':
    case 'sint64':
    case 'fixed64':
    case 'sfixed64':
      return t.tsBigIntKeyword()
    case 'bytes':
      return t.tsTypeReference(t.identifier('Uint8Array'));
    case 'bool':
      return t.tsBooleanKeyword();
    default:
      throw new Error('getTSType() type not found');
  };
};

export const isPrimitiveType = (type: string) => {
  switch (type) {
    case 'string':
    case 'double':
    case 'float':
    case 'int32':
    case 'uint32':
    case 'sint32':
    case 'fixed32':
    case 'sfixed32':
    case 'int64':
    case 'uint64':
    case 'sint64':
    case 'fixed64':
    case 'sfixed64':
    case 'bytes':
    case 'bool':
      return true;
    default:
      return false;
  };
};

export const resolveTypeName = (type: string) => {
  if (isPrimitiveType(type)) {
    return getTSType(type);
  }
  return t.tsTypeReference(t.identifier(type));
}

export const transformEnumToAST = (enumData) => {
  const members = Object.entries(enumData.values).map(([key, value]) =>
    t.tsEnumMember(t.identifier(key), t.numericLiteral(value as number))
  );

  const enumDeclaration = t.tsEnumDeclaration(t.identifier(enumData.name), members);
  return t.exportNamedDeclaration(enumDeclaration);
};

export const transformTypeToAST = (type: Type) => {
  const typeName = type.name;
  // @ts-ignore
  const fields: Field[] = type.fields;
  const properties =
    Object.entries(fields)
      .map(([fieldName, fieldData]) => {
        const type = resolveTypeName(fieldData.type);
        const fieldType = fieldData.rule === 'repeated' ?
          t.tsArrayType(type) :
          type;
        return t.tsPropertySignature(t.identifier(getFieldName(fieldData, fieldName)), t.tsTypeAnnotation(fieldType));
      });

  const interfaceDecl = t.tsInterfaceDeclaration(
    t.identifier(typeName),
    null,
    [],
    t.tsInterfaceBody(properties)
  );

  // Wrap the interface declaration in an export statement
  return t.exportNamedDeclaration(interfaceDecl, []);
}

export const generateTSInterfaces = (types: Type[]) => {
  const ast = t.file(t.program(types.map(type => transformTypeToAST(type))));
  const { code } = generate(ast);
  return code;
}

export const generateTSEnums = (enums: Enum[]) => {
  const ast = t.file(t.program(enums.map(enm => transformEnumToAST(enm))));
  const { code } = generate(ast);
  return code;
}

export const generateTSEnumFunction = (enums: Enum[]) => {
  const ast = t.file(t.program(buildEnumValueFunctionAST(enums)));
  const { code } = generate(ast);
  return code;
}



export const buildEnumValueFunctionAST = (enumData: Enum[]) => {
  // Create the union type for EnumType
  const enumTypeIdentifier = t.identifier('EnumType');
  const enumTypeUnion = t.tsUnionType(
    enumData.map(enumDef => t.tsLiteralType(t.stringLiteral(enumDef.name)))
  );
  const enumTypeAlias = t.tsTypeAliasDeclaration(enumTypeIdentifier, null, enumTypeUnion);

  // Create the function parameter and its type
  const enumTypeParam = t.identifier('enumType');
  const enumTypeParamAnnotation = t.tsTypeAnnotation(t.tsTypeReference(enumTypeIdentifier));
  enumTypeParam.typeAnnotation = enumTypeParamAnnotation;

  const keyParam = t.identifier('key');
  const keyParamAnnotation = t.tsTypeAnnotation(
    t.tsUnionType([t.tsStringKeyword(), t.tsNumberKeyword()])
  );
  keyParam.typeAnnotation = keyParamAnnotation;

  // Create the switch cases for the outer switch statement
  const outerCases = enumData.map(enumDef => {
    const innerCases = Object.entries(enumDef.values).map(([key, value]) => {
      return t.switchCase(t.stringLiteral(key), [t.returnStatement(t.numericLiteral(value))]);
    });

    // Add the reverse mapping cases
    innerCases.push(...Object.entries(enumDef.values).map(([key, value]) => {
      return t.switchCase(t.numericLiteral(value), [t.returnStatement(t.stringLiteral(key))]);
    }));

    // Add the default case for the inner switch
    innerCases.push(t.switchCase(null, [
      t.throwStatement(t.newExpression(t.identifier('Error'), [t.stringLiteral(`Key not recognized in enum ${enumDef.name}`)]))
    ]));

    return t.switchCase(t.stringLiteral(enumDef.name), [
      t.blockStatement([t.switchStatement(keyParam, innerCases)])
    ]);
  });

  // Add the default case for the outer switch
  outerCases.push(t.switchCase(null,
    [
      t.throwStatement(
        t.newExpression(t.identifier('Error'), [t.stringLiteral('Enum type not recognized')])
      )
    ]
  ));

  // Create the outer switch statement
  const switchStatement = t.switchStatement(enumTypeParam, outerCases);

  // Create the function body
  const functionBody = t.blockStatement([switchStatement]);

  // Create the arrow function expression
  const arrowFunctionExpression = t.arrowFunctionExpression(
    [enumTypeParam, keyParam],
    functionBody
  );

  // Create the variable declarator for the function
  const variableDeclarator = t.variableDeclarator(
    t.identifier('getEnumValue'),
    arrowFunctionExpression
  );

  // Create the variable declaration (const getEnumValue = ...)
  const variableDeclaration = t.variableDeclaration('const', [variableDeclarator]);

  // Export the arrow function
  const exportedFunction = t.exportNamedDeclaration(variableDeclaration, []);

  // Export the type
  const exportedEnumTypeAlias = t.exportNamedDeclaration(enumTypeAlias, []);

  // Return the entire AST
  return [exportedEnumTypeAlias, exportedFunction];
}
