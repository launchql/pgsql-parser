import { join, resolve, basename } from 'path'
import { readFileSync } from 'fs';
import { PgProtoParser } from '../src/parser'
import { sync as glob } from 'glob'
import { PgProtoParserOptions } from '../src/options';

it('utils', () => {
  // https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
  const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
  const outDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'utils'));
  const options: PgProtoParserOptions = {
    outDir,
    utils: {
      astHelpers: {
        enabled: true
      },
      enums: {
        enabled: true
      }
    }
  };
  const parser = new PgProtoParser(testProtoFile, options);
  parser.write();
  const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
  expect(out).toMatchSnapshot();
})

it('inline', () => {
  // https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
  const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
  const outDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'inline'));
  const options: PgProtoParserOptions = {
    outDir,
    utils: {
      astHelpers: {
        enabled: true,
        inlineNestedObj: true,
        nestedObjFile: 'path-obj.ts'
      },
      enums: {
        enabled: true
      }
    }
  };
  const parser = new PgProtoParser(testProtoFile, options);
  parser.write();
  const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
  expect(out).toMatchSnapshot();
})
