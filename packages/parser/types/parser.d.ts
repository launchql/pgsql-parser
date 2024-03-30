export interface ParseProtoOptions {
    keepCase?: boolean;
    alternateCommentMode?: boolean;
    preferTrailingComment?: boolean;
}
export declare class PgProtoParser {
    private inputFile;
    private outputDir;
    private parseOptions;
    constructor(inputFile: string, outputDir: string, parseOptions?: ParseProtoOptions);
    private readProtoFile;
    private parseProto;
    write(): void;
}
