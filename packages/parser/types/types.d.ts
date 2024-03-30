export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};
export interface PgProtoStoreOptions {
    includeEnumsJSON?: boolean;
    includeTypes?: boolean;
    includeUtils?: boolean;
    includeEnumTypeUnion?: boolean;
    includeEnums?: boolean;
    removeUndefinedAt0?: boolean;
    outDir?: string;
}
export interface ParseProtoOptions {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    preferTrailingComment?: boolean;
}
export declare const defaultPgProtoParserOptions: PgProtoParserOptions;
