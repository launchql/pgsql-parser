import deepmerge from 'deepmerge';

import { PgProtoParserOptions } from "./types";

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

export const getOptionsWithDefaults = (options: PgProtoParserOptions): PgProtoParserOptions => {
    // If an element at the same key is present for both x and y in deepmerge(x,y), the value from y will appear in the result.
    options = deepmerge(defaultPgProtoParserOptions, options ?? {});
    return options;
};