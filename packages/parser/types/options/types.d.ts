export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};
/**
 * Configuration options for PgProtoStore.
 */
export interface PgProtoStoreOptions {
    outDir?: string;
    exclude?: string[];
    utils?: {
        enums?: {
            enabled?: boolean;
            filename?: string;
        };
        astHelpers?: {
            enabled?: boolean;
            wrappedTypesSource?: string;
            inlineNestedObj?: boolean;
            nestedObjFile?: string;
            filename?: string;
        };
    };
    types?: {
        enabled?: boolean;
        filename?: string;
        optionalFields?: boolean;
        enumsSource?: string;
        wrapped?: {
            enabled?: boolean;
            enumsSource?: string;
            filename?: string;
        };
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
