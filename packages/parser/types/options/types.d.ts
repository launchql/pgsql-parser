export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};
/**
 * Configuration options for PgProtoStore.
 */
export interface PgProtoStoreOptions {
    outDir?: string;
    utils?: {
        enums?: {
            enabled?: boolean;
            filename?: string;
            enumsAsTypeUnion?: boolean;
        };
        astHelpers?: {
            enabled?: boolean;
            typeSource?: string;
            inlineNestedObj?: boolean;
            nestedObjFile?: string;
        };
    };
    types?: {
        enabled?: boolean;
        optionalFields?: boolean;
    };
    enums?: {
        enabled?: boolean;
        json?: {
            enabled?: boolean;
            toIntOutFile?: string;
            toStrOutFile?: string;
        };
        removeUndefinedAt0?: boolean;
    };
    includeHeader?: boolean;
}
export interface ParseProtoOptions {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    preferTrailingComment?: boolean;
}
