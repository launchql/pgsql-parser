import { PgProtoParser, PgProtoParserOptions } from '../src';
import { resolve, join } from 'path';
import { getTestProtoPath } from '../test-utils';

const inFile: string = getTestProtoPath('13-latest.proto')
const outDir: string = resolve(join(__dirname, '../test-utils/utils'));

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
