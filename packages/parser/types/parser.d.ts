import { PgProtoParserOptions } from './options';
export declare class PgProtoParser {
    inFile: string;
    options: PgProtoParserOptions;
    constructor(inFile: string, options?: PgProtoParserOptions);
    private readProtoFile;
    private parseProto;
    write(): void;
}
