import { Enum } from '@launchql/protobufjs';
import * as t from '@babel/types';
import { createNamedImport } from '../../utils';

export const convertEnumToTsEnumDeclaration = (enumData: Enum) => {
  const members = Object.entries(enumData.values).map(([key, value]) =>
    t.tsEnumMember(t.identifier(key), t.numericLiteral(value as number))
  );

  const enumDeclaration = t.tsEnumDeclaration(t.identifier(enumData.name), members);
  return t.exportNamedDeclaration(enumDeclaration);
};

export const generateEnumImports = (enums: Enum[], source: string) => {
  return createNamedImport(enums.map(e=>e.name), source);
};

export const convertEnumToTsUnionType = (enumData: Enum) => {
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

export const generateEnumValueFunctions = (enumData: Enum[]) => {
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

export const generateEnumToIntFunctions = (enumData: Enum[]) => {
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
  const keyParamAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());
  keyParam.typeAnnotation = keyParamAnnotation;

  // Create return type annotation
  const returnTypeAnnotation = t.tsTypeAnnotation(t.tsNumberKeyword());

  // Create the switch cases for the outer switch statement
  const outerCases = enumData.map(enumDef => {
    const innerCases = Object.entries(enumDef.values).map(([key, value]) => {
      return t.switchCase(t.stringLiteral(key), [t.returnStatement(t.numericLiteral(value))]);
    });

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

  // Create the arrow function expression with return type
  const arrowFunctionExpression = t.arrowFunctionExpression(
    [enumTypeParam, keyParam],
    functionBody
  );
  arrowFunctionExpression.returnType = returnTypeAnnotation;

  // Create the variable declarator for the function
  const variableDeclarator = t.variableDeclarator(
    t.identifier('getEnumInt'),
    arrowFunctionExpression
  );

  // Create the variable declaration (const getEnumInt = ...)
  const variableDeclaration = t.variableDeclaration('const', [variableDeclarator]);

  // Export the arrow function
  const exportedFunction = t.exportNamedDeclaration(variableDeclaration, []);

  // Export the type
  const exportedEnumTypeAlias = t.exportNamedDeclaration(enumTypeAlias, []);

  // Return the entire AST
  return [exportedEnumTypeAlias, exportedFunction];
}

export const generateEnumToIntFunctionsNested = (enumData: Enum[]) => {
  // Create the union type for EnumType
  const enumTypeIdentifier = t.identifier('EnumType');
  const enumTypeUnion = t.tsUnionType(
    enumData.map(enumDef => t.tsLiteralType(t.stringLiteral(enumDef.name)))
  );
  const enumTypeAlias = t.tsTypeAliasDeclaration(enumTypeIdentifier, null, enumTypeUnion);

  // Create individual enum converter functions
  const enumConverters = enumData.map(enumDef => {
    // Create the switch cases for this enum
    const cases = Object.entries(enumDef.values).map(([key, value]) => {
      return t.switchCase(t.stringLiteral(key), [t.returnStatement(t.numericLiteral(value))]);
    });

    // Add the default case
    cases.push(t.switchCase(null, [
      t.throwStatement(t.newExpression(t.identifier('Error'), [t.stringLiteral(`Key not recognized in enum ${enumDef.name}`)]))
    ]));

    // Create the switch statement
    const switchStatement = t.switchStatement(t.identifier('key'), cases);

    // Create the arrow function
    const arrowFunction = t.arrowFunctionExpression(
      [t.identifier('key')],
      t.blockStatement([switchStatement])
    );

    // Add type annotations
    const keyParam = arrowFunction.params[0] as t.Identifier;
    keyParam.typeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());
    arrowFunction.returnType = t.tsTypeAnnotation(t.tsNumberKeyword());

    // Create the property
    return t.objectProperty(
      t.stringLiteral(enumDef.name),
      arrowFunction
    );
  });

  // Create the object expression
  const enumToIntObject = t.objectExpression(enumConverters);

  // Create the type for the object
  const enumToIntMapType = t.tsTypeLiteral(
    enumData.map(enumDef => {
      const functionType = t.tsFunctionType(
        null,
        [t.identifier('key')],
        t.tsTypeAnnotation(t.tsNumberKeyword())
      );
      const keyParam = functionType.parameters[0] as t.Identifier;
      keyParam.typeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());
      
      return t.tsPropertySignature(
        t.stringLiteral(enumDef.name),
        t.tsTypeAnnotation(functionType)
      );
    })
  );

  // Create the type alias for the map
  const enumToIntMapTypeAlias = t.tsTypeAliasDeclaration(
    t.identifier('EnumToIntMap'),
    null,
    enumToIntMapType
  );

  // Create the const assertion for better type inference
  const enumToIntIdentifier = t.identifier('enumToIntMap');
  enumToIntIdentifier.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(t.identifier('EnumToIntMap'))
  );
  
  const enumToIntDeclarator = t.variableDeclarator(
    enumToIntIdentifier,
    enumToIntObject
  );

  const enumToIntDeclaration = t.variableDeclaration('const', [enumToIntDeclarator]);

  // Export the object
  const exportedObject = t.exportNamedDeclaration(enumToIntDeclaration, []);

  // Export the types
  const exportedEnumType = t.exportNamedDeclaration(enumTypeAlias, []);
  const exportedMapType = t.exportNamedDeclaration(enumToIntMapTypeAlias, []);

  return [exportedEnumType, exportedMapType, exportedObject];
}

export const generateEnumToStringFunctionsNested = (enumData: Enum[]) => {
  // Create the union type for EnumType
  const enumTypeIdentifier = t.identifier('EnumType');
  const enumTypeUnion = t.tsUnionType(
    enumData.map(enumDef => t.tsLiteralType(t.stringLiteral(enumDef.name)))
  );
  const enumTypeAlias = t.tsTypeAliasDeclaration(enumTypeIdentifier, null, enumTypeUnion);

  // Create individual enum converter functions
  const enumConverters = enumData.map(enumDef => {
    // Create the switch cases for this enum
    const cases = Object.entries(enumDef.values).map(([key, value]) => {
      return t.switchCase(t.numericLiteral(value), [t.returnStatement(t.stringLiteral(key))]);
    });

    // Add the default case
    cases.push(t.switchCase(null, [
      t.throwStatement(t.newExpression(t.identifier('Error'), [t.stringLiteral(`Value not recognized in enum ${enumDef.name}`)]))
    ]));

    // Create the switch statement
    const switchStatement = t.switchStatement(t.identifier('value'), cases);

    // Create the arrow function
    const arrowFunction = t.arrowFunctionExpression(
      [t.identifier('value')],
      t.blockStatement([switchStatement])
    );

    // Add type annotations
    const valueParam = arrowFunction.params[0] as t.Identifier;
    valueParam.typeAnnotation = t.tsTypeAnnotation(t.tsNumberKeyword());
    arrowFunction.returnType = t.tsTypeAnnotation(t.tsStringKeyword());

    // Create the property
    return t.objectProperty(
      t.stringLiteral(enumDef.name),
      arrowFunction
    );
  });

  // Create the object expression
  const enumToStringObject = t.objectExpression(enumConverters);

  // Create the type for the object
  const enumToStringMapType = t.tsTypeLiteral(
    enumData.map(enumDef => {
      const functionType = t.tsFunctionType(
        null,
        [t.identifier('value')],
        t.tsTypeAnnotation(t.tsStringKeyword())
      );
      const valueParam = functionType.parameters[0] as t.Identifier;
      valueParam.typeAnnotation = t.tsTypeAnnotation(t.tsNumberKeyword());
      
      return t.tsPropertySignature(
        t.stringLiteral(enumDef.name),
        t.tsTypeAnnotation(functionType)
      );
    })
  );

  // Create the type alias for the map
  const enumToStringMapTypeAlias = t.tsTypeAliasDeclaration(
    t.identifier('EnumToStringMap'),
    null,
    enumToStringMapType
  );

  // Create the const assertion for better type inference
  const enumToStringIdentifier = t.identifier('enumToStringMap');
  enumToStringIdentifier.typeAnnotation = t.tsTypeAnnotation(
    t.tsTypeReference(t.identifier('EnumToStringMap'))
  );
  
  const enumToStringDeclarator = t.variableDeclarator(
    enumToStringIdentifier,
    enumToStringObject
  );

  const enumToStringDeclaration = t.variableDeclaration('const', [enumToStringDeclarator]);

  // Export the object
  const exportedObject = t.exportNamedDeclaration(enumToStringDeclaration, []);

  // Export the types
  const exportedEnumType = t.exportNamedDeclaration(enumTypeAlias, []);
  const exportedMapType = t.exportNamedDeclaration(enumToStringMapTypeAlias, []);

  return [exportedEnumType, exportedMapType, exportedObject];
}

export const generateEnumToStringFunctions = (enumData: Enum[]) => {
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
  const keyParamAnnotation = t.tsTypeAnnotation(t.tsNumberKeyword());
  keyParam.typeAnnotation = keyParamAnnotation;

  // Create return type annotation
  const returnTypeAnnotation = t.tsTypeAnnotation(t.tsStringKeyword());

  // Create the switch cases for the outer switch statement
  const outerCases = enumData.map(enumDef => {
    const innerCases = Object.entries(enumDef.values).map(([key, value]) => {
      return t.switchCase(t.numericLiteral(value), [t.returnStatement(t.stringLiteral(key))]);
    });

    // Add the default case for the inner switch
    innerCases.push(t.switchCase(null, [
      t.throwStatement(t.newExpression(t.identifier('Error'), [t.stringLiteral(`Value not recognized in enum ${enumDef.name}`)]))
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

  // Create the arrow function expression with return type
  const arrowFunctionExpression = t.arrowFunctionExpression(
    [enumTypeParam, keyParam],
    functionBody
  );
  arrowFunctionExpression.returnType = returnTypeAnnotation;

  // Create the variable declarator for the function
  const variableDeclarator = t.variableDeclarator(
    t.identifier('getEnumString'),
    arrowFunctionExpression
  );

  // Create the variable declaration (const getEnumString = ...)
  const variableDeclaration = t.variableDeclaration('const', [variableDeclarator]);

  // Export the arrow function
  const exportedFunction = t.exportNamedDeclaration(variableDeclaration, []);

  // Export the type
  const exportedEnumTypeAlias = t.exportNamedDeclaration(enumTypeAlias, []);

  // Return the entire AST
  return [exportedEnumTypeAlias, exportedFunction];
}
