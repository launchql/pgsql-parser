import { join, resolve, basename } from 'path'
import { readFileSync } from 'fs';
import { PgProtoParser } from '../src/parser'
import { sync as glob } from 'glob'

it('parser', () => {
  // https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
  const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
  const outputDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'parser'));
  const parser = new PgProtoParser(testProtoFile, outputDir);
  parser.write();
  const out = glob(outputDir + '**/*').map(file=>({file: basename(file), code: readFileSync(file, 'utf-8')}));
  expect(out).toMatchSnapshot();
})
