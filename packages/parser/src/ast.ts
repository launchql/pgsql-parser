import { Type, Field, Enum } from '@launchql/protobufjs';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { getFieldName, toSpecialCamelCase } from './utils';
import { PgProtoParserOptions } from './types';
import { PgProtoParser } from './parser';

const specialTypes = ['TypeName'];

export const getTSType = (type: string = 'any') => {
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
      // For custom types, reference them directly
      return t.tsTypeReference(t.identifier(type));

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

export const generateTSInterfaces = (types: Type[], options: PgProtoParserOptions) => {
  const node = createUnionTypeAST(types.filter(type => type.name !== 'Node'));
  const typeDefns = types.reduce((m, type) => {
    if (type.name === 'Node') return m;
    return [...m, transformTypeToAST(type, options)]
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
    // generateMacroForTypes(),
    generateAstHelperMethodsAST(types)
  ]));
  const { code } = generate(ast);
  return code;
}

export const generateTSASTHelpersImports = (types: Type[], options: PgProtoParserOptions) => {
  const ast = t.file(t.program([generateImportSpecifiersAST(types, options)]));
  const { code } = generate(ast);
  return code;
}

export const transformEnumToAST = (enumData) => {
  const members = Object.entries(enumData.values).map(([key, value]) =>
    t.tsEnumMember(t.identifier(key), t.numericLiteral(value as number))
  );

  const enumDeclaration = t.tsEnumDeclaration(t.identifier(enumData.name), members);
  return t.exportNamedDeclaration(enumDeclaration);
};

export const generateImportSpecifiersAST = (types: Type[], options: PgProtoParserOptions) => {
  const importSpecifiers = types.map(type =>
    t.importSpecifier(t.identifier(type.name), t.identifier(type.name))
  );

  const importDeclaration = t.importDeclaration(importSpecifiers, t.stringLiteral(options.astHelperTypeSource));
  return importDeclaration;
}
// export type ASTType<T> = {
//   [K in keyof T as `${K & string}`]: T;
// };

export const generateMacroForTypes = () => {

  const op = t.tsTypeOperator(t.tsTypeReference(t.identifier('T')));
  op.operator = 'keyof';

  const typeParam = t.tsTypeParameter(op, null, 'K')
  typeParam.constraint = op;

  const ast = t.exportNamedDeclaration(
    t.tsTypeAliasDeclaration(
      t.identifier('ASTType'),
      t.tsTypeParameterDeclaration([
        t.tsTypeParameter(null, null, 'T')
      ]),
      t.tsMappedType(
        typeParam,
        t.tsTypeReference(t.identifier('T')),
        t.tsLiteralType(
          t.templateLiteral(
            [
              t.templateElement({ raw: '', cooked: '' }, false),
              t.templateElement({ raw: '', cooked: '' }, true)
            ],
            [
              t.tsIntersectionType([
                t.tsTypeReference(t.identifier('K')),
                t.tsStringKeyword()
              ])
            ]
          )
        )
      )
    ),
    [],
    null
  );
  ast.exportKind = 'type';
  return ast;
}

export const generateAstHelperMethodsAST = (types: Type[]): t.ExportDefaultDeclaration => {
  const creators = types.filter(type => type.name !== 'Node').map((type: Type) => {
    const typeName = type.name;
    const param = t.identifier('_p');
    param.optional = true;
    param.typeAnnotation = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));

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

    if (!specialTypes.includes(type.name)) {
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

    if (specialTypes.includes(typeName)) {
      method.returnType = t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)));
    } else {
      method.returnType =
        t.tsTypeAnnotation(
          t.tsTypeLiteral([
            t.tsPropertySignature(
              t.identifier(typeName),
              t.tsTypeAnnotation(t.tsTypeReference(t.identifier(typeName)))
            )
          ])
        );
    }


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

export const transformTypeToAST = (type: Type, options: PgProtoParserOptions) => {
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

  const interfaceDecl = t.tsInterfaceDeclaration(
    t.identifier(typeName),
    null,
    [],
    t.tsInterfaceBody(properties)
  );

  // Wrap the interface declaration in an export statement
  return t.exportNamedDeclaration(interfaceDecl, []);
}


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
