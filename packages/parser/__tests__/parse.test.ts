import { parse } from '@launchql/protobufjs';
import { readFileSync } from 'fs';
import { join, resolve } from 'path'

interface ParseProtoOptions {
  keepCase?: boolean;
  alternateCommentMode?: boolean;
  preferTrailingComment?: boolean;
}

const protoParseOptionsDefaults = {
  keepCase: false,
  alternateCommentMode: true,
  preferTrailingComment: false
};

// https://raw.githubusercontent.com/pganalyze/libpg_query/15-latest/protobuf/pg_query.proto
const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));

export const parseProtoFile = (filepath, options?: ParseProtoOptions) => {
  return parseProto(readFileSync(filepath, 'utf-8'), options);
};

export const parseProto = (content, options?: ParseProtoOptions) => {
  if (!options) {
      options = protoParseOptionsDefaults
  }
  return parse(content, options);
};

it('works', () => {
   const ast = parseProtoFile(testProtoFile);
   console.log(JSON.stringify(ast, null, 2));
});