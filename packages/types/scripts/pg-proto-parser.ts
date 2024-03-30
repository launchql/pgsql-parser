import { PgProtoParser } from 'pg-proto-parser';
import { resolve, join } from 'path';

const inFile: string = join(__dirname, '../../../pg_query.proto');
const outDir: string = resolve(join(__dirname, '../src/types'));

const parser = new PgProtoParser(inFile, {
  outDir,
  includeEnums: false,
  includeEnumsJSON: false,
  includeEnumTypeUnion: true,
  includeTypes: true,
  includeUtils: false,
  removeUndefinedAt0: true,
  parser: {
    keepCase: false
  }
});

parser.write();
