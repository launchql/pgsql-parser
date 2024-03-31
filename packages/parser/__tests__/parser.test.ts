import { join, resolve, basename } from 'path'
import { readFileSync } from 'fs';
import { PgProtoParser } from '../src/parser'
import { sync as glob } from 'glob'
import { getUndefinedKey } from '../src/utils';

it('getUndefinedKey', () => {
  expect(getUndefinedKey('SQLValueFunctionOp')).toEqual('SQLVALUE_FUNCTION_OP_UNDEFINED');
  expect(getUndefinedKey('AlterTSConfigType')).toEqual('ALTER_TSCONFIG_TYPE_UNDEFINED');
  expect(getUndefinedKey('A_Expr_Kind')).toEqual('A_EXPR_KIND_UNDEFINED');
});

it('parser', () => {
  // https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
  const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
  const outDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'parser'));
  const parser = new PgProtoParser(testProtoFile, {
    outDir,
    types: {
      optionalFields: false
    },
    enums: {
      removeUndefinedAt0: true
    }
  });
  parser.write();
  const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
  expect(out).toMatchSnapshot();
})

it('keep undefined', () => {
  // https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
  const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
  const outDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'undef'));
  const parser = new PgProtoParser(testProtoFile, {
    outDir,
    types: {
      optionalFields: true
    },
    enums: {
      removeUndefinedAt0: false
    }
  });
  parser.write();
  const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
  expect(out).toMatchSnapshot();
})
