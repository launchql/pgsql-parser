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
        filename?: string;
        optionalFields?: boolean;
        enumsSource?: string;
    };
    enums?: {
        enabled?: boolean;
        filename?: string;
        enumsAsTypeUnion?: boolean;
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
