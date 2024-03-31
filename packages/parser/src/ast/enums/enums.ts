import { Enum } from '@launchql/protobufjs';
import * as t from '@babel/types';


export const transformEnumToAST = (enumData: Enum) => {
  const members = Object.entries(enumData.values).map(([key, value]) =>
    t.tsEnumMember(t.identifier(key), t.numericLiteral(value as number))
  );

  const enumDeclaration = t.tsEnumDeclaration(t.identifier(enumData.name), members);
  return t.exportNamedDeclaration(enumDeclaration);
};

export const transformEnumToTypeUnionAST = (enumData: Enum) => {
  const literals = Object.keys(enumData.values).map(key =>
    t.tsLiteralType(t.stringLiteral(key))
  );

  const unionType = t.tsUnionType(literals);

  const typeAlias = t.tsTypeAliasDeclaration(
    t.identifier(enumData.name),
    null,
    unionType
  );

  return t.exportNamedDeclaration(typeAlias);
};

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
