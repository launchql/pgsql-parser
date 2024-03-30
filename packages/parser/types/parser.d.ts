import { PgProtoParserOptions } from './types';
export declare class PgProtoParser {
    inFile: string;
    options: PgProtoParserOptions;
    constructor(inFile: string, options?: PgProtoParserOptions);
    private readProtoFile;
    private parseProto;
    write(): void;
}
