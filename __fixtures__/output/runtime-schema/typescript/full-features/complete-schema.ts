import { NodeSpec, FieldSpec } from './runtime-schema/types';

export const runtimeSchema: NodeSpec[] = [
  {
    name: "CreateStmt",
    wrapped: true,
    fields: [
      { name: "relation", type: "RangeVar", isNode: true, isArray: false, optional: false },
      { name: "of_typename", type: "TypeName", isNode: true, isArray: false, optional: true }
    ]
  }
];