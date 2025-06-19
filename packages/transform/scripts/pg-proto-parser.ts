import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';
import { resolve, join } from 'path';

const versions = ['13', '17'];
const baseDir = resolve(join(__dirname, '../../../__fixtures__/proto'));

for (const version of versions) {
  const inFile = join(baseDir, `${version}-latest.proto`);
  const outDir = resolve(join(__dirname, `../src/${version}`));

  const options: PgProtoParserOptions = {
    outDir,
    types: {
      enabled: true,
      wrappedNodeTypeExport: true
    },
    enums: {
      enabled: true,
      enumsAsTypeUnion: true
    }
  };

  const parser = new PgProtoParser(inFile, options);
  parser.write();
}
