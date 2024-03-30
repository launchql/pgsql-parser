import { parse } from '@launchql/protobufjs';
import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path'
import { ProtoStore } from '../src/store'

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

// https://raw.githubusercontent.com/pganalyze/libpg_query/15-latest/protobuf/pg_query.proto
const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
const outProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.json'));
const outTSFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.ts'));
const out2StrJSONFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.2str.json'));
const out2IntJSONFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.2int.json'));
const outEnumFuncFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.enumUtils.ts'));

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
//    console.log(JSON.stringify(ast, null, 2));

   const store = new ProtoStore(ast.root);
//    console.log(store.print());

//    writeFileSync(outProtoFile, JSON.stringify(ast, null, 2));
   writeFileSync(outTSFile, store.print());
   writeFileSync(out2IntJSONFile, JSON.stringify(store.printEnum2IntJSON(), null, 2));
   writeFileSync(out2StrJSONFile, JSON.stringify(store.printEnum2StrJSON(), null, 2));
   writeFileSync(outEnumFuncFile, store.printEnumsFn());
});