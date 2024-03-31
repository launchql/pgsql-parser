import { join, resolve, basename } from 'path'
import { readFileSync } from 'fs';
import { PgProtoParser } from '../src/parser'
import { sync as glob } from 'glob'
import { PgProtoParserOptions } from '../src/options';

const testProtoFile = resolve(join(__dirname, '../../../__fixtures__/proto/16-latest.proto'));
const getOutDir = (test) => resolve(join(__dirname, '../../../__fixtures__/', 'output', test));
describe('pure enums', () => {

  it('enums', () => {
    const outDir = getOutDir('pure-enums');
    const options: PgProtoParserOptions = {
      outDir,
      enums: {
        enabled: true,
        enumsAsTypeUnion: false,
        removeUndefinedAt0: false
      }
    };
    const parser = new PgProtoParser(testProtoFile, options);

    parser.write();
    const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
    expect(out).toMatchSnapshot();
  })

  it('removeAt0', () => {
    const outDir = getOutDir('pure-enums-rm0');
    const options: PgProtoParserOptions = {
      outDir,
      enums: {
        enabled: true,
        enumsAsTypeUnion: false,
        removeUndefinedAt0: true
      }
    };
    const parser = new PgProtoParser(testProtoFile, options);

    parser.write();
    const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
    expect(out).toMatchSnapshot();
  })
})


describe('typeUnion', () => {

  it('enums', () => {
    const outDir = getOutDir('str-enums');
    const options: PgProtoParserOptions = {
      outDir,
      enums: {
        enabled: true,
        enumsAsTypeUnion: true,
        removeUndefinedAt0: false
      }
    };
    const parser = new PgProtoParser(testProtoFile, options);

    parser.write();
    const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
    expect(out).toMatchSnapshot();
  })

  it('removeAt0', () => {
    const outDir = getOutDir('str-enums-rm0');
    const options: PgProtoParserOptions = {
      outDir,
      enums: {
        enabled: true,
        enumsAsTypeUnion: true,
        removeUndefinedAt0: true
      }
    };
    const parser = new PgProtoParser(testProtoFile, options);

    parser.write();
    const out = glob(outDir + '**/*').map(file => ({ file: basename(file), code: readFileSync(file, 'utf-8') }));
    expect(out).toMatchSnapshot();
  })
})


