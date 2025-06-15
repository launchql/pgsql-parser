import { NodeSpec, FieldSpec } from './runtime-schema/types';

export const runtimeSchema: NodeSpec[] = [
  {
    name: "SelectStmt",
    wrapped: true,
    fields: [
      { name: "targetList", type: "ResTarget", isNode: true, isArray: true, optional: true },
      { name: "fromClause", type: "RangeVar", isNode: true, isArray: true, optional: true }
    ]
  }
];