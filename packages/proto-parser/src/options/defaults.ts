import deepmerge from 'deepmerge';

import { PgProtoParserOptions } from "./types";

// Define default options outside of the class
export const defaultPgProtoParserOptions: PgProtoParserOptions = {
    outDir: `${process.cwd()}/out`,
    includeHeader: true,
    exclude: [],
    utils: {
        enums: {
            enabled: false,
            filename: 'utils.ts',
        },
        astHelpers: {
            enabled: false,
            wrappedTypesSource: './wrapped',
            inlineNestedObj: false,
            nestedObjFile: 'nested-obj.ts',
            filename: 'asts.ts',
        }
    },
    types: {
        enabled: false,
        filename: 'types.ts',
        optionalFields: true,
        enumsSource: './enums',
        wrappedNodeTypeExport: false,
        wrapped: {
            enabled: false,
            enumsSource: './enums',
            filename: 'wrapped.ts'
        }
    },
    enums: {
        enabled: false,
        filename: 'enums.ts',
        enumsAsTypeUnion: true,

        enumMap: {
            enabled: false,
            format: 'ts',
            toIntOutFile: 'enums2int.ts',
            toStrOutFile: 'enums2str.ts'
        },
        removeUndefinedAt0: true
    },
    runtimeSchema: {
        enabled: false,
        filename: 'runtime-schema',
        format: 'json'
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
