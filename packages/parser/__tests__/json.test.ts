import { join, resolve, basename } from 'path'
import { readFileSync } from 'fs';
import { PgProtoParser } from '../src/parser'
import { sync as glob } from 'glob'
import { PgProtoParserOptions } from '../src/options';

it('json', () => {
  const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
  const outDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'json'));
  const options: PgProtoParserOptions = {
    outDir,
    enums: {
      json: {
        enabled: true
      }
    }
  };
  const parser = new PgProtoParser(testProtoFile, options);
  
  parser.write();
  const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
  expect(out).toMatchSnapshot();
})


