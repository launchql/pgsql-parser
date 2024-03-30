export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};

export interface PgProtoStoreOptions {
    includeEnumsJSON?: boolean;
    includeTypes?: boolean;
    includeUtils?: boolean;
    outDir?: string;
}

export interface ParseProtoOptions {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    preferTrailingComment?: boolean;
}

// Define default options outside of the class
export const defaultPgProtoParserOptions: PgProtoParserOptions = {
    includeEnumsJSON: true,
    includeTypes: true,
    includeUtils: true,
    outDir: `${process.cwd()}/out`,
    parser: {
        keepCase: true,
        alternateCommentMode: true,
        preferTrailingComment: false
    }
};

