import { parse } from '@launchql/protobufjs';
import { readFileSync } from 'fs';
import { join, resolve, basename } from 'path'
import { sync as glob } from 'glob'
import { ProtoStore } from '../src/store'
import { PgProtoParserOptions } from '../src/options';

interface ParseProtoOptions {
  keepCase?: boolean;
  alternateCommentMode?: boolean;
  preferTrailingComment?: boolean;
}

const protoParseOptionsDefaults = {
  keepCase: true,
  alternateCommentMode: true,
  preferTrailingComment: false
};


// https://raw.githubusercontent.com/pganalyze/libpg_query/16-latest/protobuf/pg_query.proto
const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
const outDir = resolve(join(__dirname, '../../../__fixtures__/', 'output', 'store'));

export const parseProtoFile = (filepath, options?: ParseProtoOptions) => {
  return parseProto(readFileSync(filepath, 'utf-8'), options);
};

export const parseProto = (content, options?: ParseProtoOptions) => {
  if (!options) {
    options = protoParseOptionsDefaults
  }
  return parse(content, options);
};

it('convert protos to typescript', () => {

  const options: PgProtoParserOptions = {
    outDir,
    types: {
      enabled: true
    },
    enums: {
      enabled: true,
      json: {
        enabled: true
      }
    },
    utils: {
      enums: {
        enabled: true
      }
    }
  };

  const ast = parseProtoFile(testProtoFile);
  const store = new ProtoStore(ast.root, options);
  store.write();
  const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
  expect(out).toMatchSnapshot();
});