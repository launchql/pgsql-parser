import { PgProtoParser } from 'pg-proto-parser';
import { resolve, join } from 'path';

const inFile: string = join(__dirname, '../../../pg_query.proto');
const outDir: string = resolve(join(__dirname, '../src/enums'));

const parser = new PgProtoParser(inFile, {
  outDir,
  includeEnums: false,
  includeEnumsJSON: true,
  includeEnumTypeUnion: false,
  includeTypes: false,
  includeUtils: false,
  removeUndefinedAt0: true,
  parser: {
    keepCase: false
  }
});

parser.write();
