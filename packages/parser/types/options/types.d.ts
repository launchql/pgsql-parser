export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};
/**
 * Configuration options for PgProtoStore.
 */
export interface PgProtoStoreOptions {
    outDir?: string;
    astHelperTypeSource?: string;
    utils?: {
        enums?: {
            enabled?: boolean;
        };
        astHelpers?: {
            enabled?: boolean;
            typeSource?: string;
        };
    };
    types?: {
        enabled?: boolean;
        optionalFields?: boolean;
        enumsAsTypeUnion?: boolean;
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
