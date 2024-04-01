import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';
import { resolve, join } from 'path';

const inFile: string = join(__dirname, '../../../pg_query.proto');
const outDir: string = resolve(join(__dirname, '../src'));

const options: PgProtoParserOptions = {
  outDir,
  enums: {
    enabled: true,
    enumsAsTypeUnion: false
  }
};
const parser = new PgProtoParser(inFile, options);

parser.write();
