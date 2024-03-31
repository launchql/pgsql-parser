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

// Define default options outside of the class
export const defaultPgProtoParserOptions: PgProtoParserOptions = {
    astHelperTypeSource: './types',
    includeAstHelpers: true,
    includeEnums: true,
    includeEnumsJSON: true,
    includeEnumTypeUnion: true,
    includeHeader: true,
    includeTypes: true,
    includeUtils: true,
    optionalFields: true,
    outDir: `${process.cwd()}/out`,
    removeUndefinedAt0: true,
    parser: {
        keepCase: true,
        alternateCommentMode: true,
        preferTrailingComment: false
    }
};

