import * as t from '@babel/types';

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
