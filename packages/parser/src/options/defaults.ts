import deepmerge from 'deepmerge';

import { PgProtoParserOptions } from "./types";

// Define default options outside of the class
export const defaultPgProtoParserOptions: PgProtoParserOptions = {
    outDir: `${process.cwd()}/out`,
    includeHeader: true,
    utils: {
        enums: {
            enabled: false
        },
        astHelpers: {
            enabled: false,
            typeSource: './types',
            inlineNestedObj: false,
            nestedObjFile: 'nested-obj.ts'
        }
    },
    types: {
        enabled: false,
        optionalFields: true,
        enumsAsTypeUnion: true
    },
    enums: {
        enabled: false,
        json: {
            enabled: false,
            toIntOutFile: 'enums2int.json',
            toStrOutFile: 'enums2str.json'
        },
        removeUndefinedAt0: true
    },
    parser: {
        keepCase: false,
        alternateCommentMode: true,
        preferTrailingComment: false
    }
};

export const getOptionsWithDefaults = (options: PgProtoParserOptions): PgProtoParserOptions => {
    // If an element at the same key is present for both x and y in deepmerge(x,y), the value from y will appear in the result.
    options = deepmerge(defaultPgProtoParserOptions, options ?? {});
    return options;
};