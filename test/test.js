import chai from 'chai';
import fs from 'fs';
import { sync as glob } from 'glob';

chai.should();

import { deparse, parse, clean, byType } from '../src';

const supportedStatements = [
  'SelectStmt'
  // 'CreateFunctionStmt',
  // 'CreateStmt',
  // 'TransactionStmt'
];

const isSupported = node => {
  for (var i = 0; i < supportedStatements.length; i++) {
    if (node[supportedStatements[i]] != null) return true;
  }
};

const pattern = process.env.FILTER ? `*${process.env.FILTER}*.sql` : '*.sql';

let files = glob(`./test/fixtures/${pattern}`)
  .concat(glob(`./test/fixtures/create/${pattern}`))
  .concat(glob(`./test/fixtures/functions/${pattern}`))
  .concat(glob(`./test/fixtures/tranactions/${pattern}`))
  .concat(glob(`./test/fixtures/upstream/${pattern}`));

const log = (msg) => {
  fs.writeSync(1, `${msg}\n`);
  return fs.fsyncSync(1);
};

const check = (text) => {
  const reference = parse(text).query;

  const parsed = parse(deparse(reference));

  if (parsed.error) {
    throw new Error(parsed.error + ':\n' + deparse(reference));
  }

  const result = deparse(parse(text).query);

  const json1 = JSON.stringify(clean(parse(text).query));
  const json2 = JSON.stringify(clean(parse(result).query));

  return json1.should.eq(json2);
};

const defineQueryTest = (sqlQuery, file) => {
  it(`should parse ${sqlQuery.trim()} from ${file}`, () => {
    let parsed = null;

    try {
      parsed = parse(sqlQuery);

      // Only SelectStmt's for now
      if (parsed.query && parsed.query[0] && isSupported(parsed.query[0])) {
        check(sqlQuery);
      }
    } catch (ex) {
      let unsupported = false;

      const unsupportedTypes = [
        'InsertStmt',
        'UpdateStmt',
        'DeleteStmt',
        'XmlExpr',
        'XmlSerialize'
      ];

      for (const type of unsupportedTypes) {
        if (byType(parsed.query, type).length) {
          unsupported = true;
        }
      }

      if (!unsupported) {
        log(file);
        log(sqlQuery);
        log('------------------------------------------');
        log(JSON.stringify(parsed));
        log(ex.stack);

        /* eslint-disable no-process-exit */
        process.exit(1);
        /* eslint-enable no-process-exit */
      }
    }
  });
};

const defineFileTest = (file) => {
  return () => {
    const content = fs.readFileSync(file).toString().trim();

    for (const sql of content.split(';')) {
      defineQueryTest(sql, file);
    }
  };
};

if (process.env.QUERY != null) {
  describe('parser', () =>
    it(`should parse ${process.env.QUERY}`, () => check(process.env.QUERY))
  );
} else {
  for (const file of files) {
    describe('parser: ' + file, defineFileTest(file));
  }
}
