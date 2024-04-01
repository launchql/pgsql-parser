import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';
import { resolve, join } from 'path';

const inFile: string = join(__dirname, '../../../pg_query.proto');
const outDir: string = resolve(join(__dirname, '../src'));

const options: PgProtoParserOptions = {
  outDir,
  types: {
    enabled: false,
    wrapped: {
      enabled: true,
      enumsSource: '@pgsql/types',
    }
  },
  utils: {
    astHelpers: {
      enabled: true,
      wrappedTypesSource: './wrapped'
    }
  }
};
const parser = new PgProtoParser(inFile, options);

parser.write();
