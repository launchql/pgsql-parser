export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};
export interface PgProtoStoreOptions {
    astHelperTypeSource?: string;
    includeAstHelpers?: boolean;
    includeEnums?: boolean;
    includeEnumsJSON?: boolean;
    includeEnumTypeUnion?: boolean;
    includeHeader?: boolean;
    includeTypes?: boolean;
    includeUtils?: boolean;
    optionalFields?: boolean;
    outDir?: string;
    removeUndefinedAt0?: boolean;
}
export interface ParseProtoOptions {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    preferTrailingComment?: boolean;
}
export declare const defaultPgProtoParserOptions: PgProtoParserOptions;
