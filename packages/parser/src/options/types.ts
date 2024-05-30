export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};

/**
 * Configuration options for PgProtoStore.
 */
export interface PgProtoStoreOptions {
    // The directory where the generated files will be saved.
    outDir?: string;

    // Types and Enums to skip during processing
    exclude?: string[],

    // Options related to utility functions.
    utils?: {
        enums?: {
            // Whether to include TypeScript utils for enums
            enabled?: boolean;
            // Enums helpers filename
            filename?: string;
        }

        // AST helper functions.
        astHelpers?: {
            // Whether to include TypeScript AST builders
            enabled?: boolean;
            // Source file for AST helper types.
            wrappedTypesSource?: string;
            // Whether to inline nested-obj
            inlineNestedObj?: boolean;
            // if inlined, filename
            nestedObjFile?: string;
            // ASTs helpers filename
            filename?: string;
        }
    };

    // Options related to TypeScript types.
    types?: {
        // Whether to generate TypeScript interfaces for protobuf messages.
        enabled?: boolean;
        // Types filename
        filename?: string;
        // Whether fields in TypeScript interfaces should be optional.
        optionalFields?: boolean;
        // Enums source specifier
        enumsSource?: string;
        // Node Object Keys, e.g. { ParseResult: ParseResult, ... }
        // meant for simpler user cases where wrapped is advanced
        // if a field in an object uses Node, it's wrapped
        // if a field in an object references a type, e.g. RangeVar, it's flat
        wrappedNodeTypeExport?: boolean;
        // wrapped types, for building AST
        wrapped?: {
            // Enabled wrapped types, to match AST
            enabled?: boolean;
            // Source file for enums
            enumsSource?: string;
            // Types filename
            filename?: string;
        }
    };

    // Options related to enumeration handling.
    enums?: {
        // Whether to include TypeScript enums.
        enabled?: boolean;
        // Enums filename
        filename?: string;
        // Whether enums in TypeScript are a union type
        enumsAsTypeUnion?: boolean;
        // Options for JSON mappings of enums.
        json?: {
            // Whether to generate JSON files mapping enum names to values.
            enabled?: boolean;
            toIntOutFile?: string;
            toStrOutFile?: string;
        };
        // Whether to remove the initial `UNDEFINED` enum entry and adjust subsequent values.
        removeUndefinedAt0?: boolean;
    };

    // Whether to include a header in generated TypeScript files.
    includeHeader?: boolean;
}


export interface ParseProtoOptions {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    preferTrailingComment?: boolean;
}
