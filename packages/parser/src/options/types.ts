export type PgProtoParserOptions = PgProtoStoreOptions & {
    parser?: ParseProtoOptions;
};

/**
 * Configuration options for PgProtoStore.
 */
export interface PgProtoStoreOptions {
    // The directory where the generated files will be saved.
    outDir?: string;

    // Options related to utility functions.
    utils?: {
        enums?: {
            // Whether to include TypeScript utils for enums
            enabled?: boolean;
        }
        
        // AST helper functions.
        astHelpers?: {
            // Whether to include TypeScript AST builders
            enabled?: boolean;
            // Source file for AST helper types.
            typeSource?: string;

            // Whether to inline nested-obj
            inlineNestedObj?: boolean;
            // if inlined, filename
            nestedObjFile?: string;
        }
    };

    // Options related to TypeScript types.
    types?: {
        // Whether to generate TypeScript interfaces for protobuf messages.
        enabled?: boolean;

        // Whether fields in TypeScript interfaces should be optional.
        optionalFields?: boolean;
        
        // Whether enums in TypeScript are a union type
        enumsAsTypeUnion?: boolean;
    };

    // Options related to enumeration handling.
    enums?: {
        // Whether to include TypeScript enums.
        enabled?: boolean;

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
