export interface FieldSpec {
  name: string;
  type: string;
  isNode: boolean;
  isArray: boolean;
  optional: boolean;
}

export interface NodeSpec {
  name: string;
  wrapped: boolean;
  fields: FieldSpec[];
}

export interface RuntimeSchemaOptions {
  enabled?: boolean;
  filename?: string;
  format?: 'json' | 'typescript';
}
