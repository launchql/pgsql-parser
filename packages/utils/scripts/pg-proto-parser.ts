import { PgProtoParser } from 'pg-proto-parser';
import { resolve, join } from 'path';

const inFile: string = join(__dirname, '../../../pg_query.proto');
const outDir: string = resolve(join(__dirname, '../src'));

const parser = new PgProtoParser(inFile, {
  outDir,
  includeAstHelpers: true,
  astHelperTypeSource: '@pgsql/types/types/wrapped',
  includeHeader: true,
  includeEnums: false,
  includeEnumsJSON: false,
  includeEnumTypeUnion: false,
  includeTypes: false,
  includeUtils: true,
  optionalFields: true,
  removeUndefinedAt0: true,

  parser: {
    keepCase: false
  }
});

parser.write();
