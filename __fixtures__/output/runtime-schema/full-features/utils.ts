export const isWrappedType = (typeName: string): boolean => {
  return ['CreateStmt', 'SelectStmt', 'TypeName', 'RangeVar'].includes(typeName);
};