import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';
import { resolve, join } from 'path';

const inFile: string = join(__dirname, '../../../pg_query.proto');
const outDir: string = resolve(join(__dirname, '../src'));

const options: PgProtoParserOptions = {
  outDir,
  utils: {
    astHelpers: {
      enabled: true,
      typeSource: '@pgsql/types/types/wrapped'
    }
  }
};
const parser = new PgProtoParser(inFile, options);

parser.write();
