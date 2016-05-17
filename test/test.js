import chai from 'chai';
chai.should();

import _ from 'lodash';

import fs from 'fs';
import glob from 'glob';
import path from 'path';

import { Deparser, parse, walk, clean } from '../src';

const deparse = Deparser.deparse;
// let { parse } = PgQuery;
// let { deparse } = PgQuery.Deparser;

let pattern =
  process.env.FILTER ?
    `*${process.env.FILTER}*.sql`
  :
    '*.sql';

let files = glob.sync(`./test/fixtures/${pattern}`);
files = files.concat(glob.sync(`./test/fixtures/upstream/${pattern}`));

let pretty = obj => JSON.stringify(obj, null, 2);

let log = function(msg) {
  fs.writeSync(1, `${msg}\n`);
  return fs.fsyncSync(1);
};

// walk = (obj, func) ->
//   if _.isArray(obj)
//     func(obj, o) for o in obj
//     walk(o, func) for o in obj
//   else if _.isObject(obj)
//     func(obj, k, v) for k, v of obj
//     walk(v, func) for k, v of obj
//   else
//     func(obj)

// let clean = function(tree) {
//   walk(tree, function(obj, k, v) {
//     if (_.isArray(obj)) { return; }
//     if (k === 'location') {
//       return delete obj.location;
//     }
//   });
//   return tree;
// };

let search = function(obj, key) {
  let needles = [];

  walk(obj, function(obj, k, v) {
    if (_.isArray(obj)) { return; }
    if (k === key) { return needles.push(obj); }
  });

  return needles;
};

// these are known to not work
let skip = [ 'create', 'begin;', 'notify', 'listen', 'unlisten' ];

let checkFile = function(filePath) {
  let content = fs.readFileSync(filePath).toString().trim();

  for (let i = 0; i < skip.length; i++) {
    let ignored = skip[i];
    if (content.toLowerCase().indexOf(ignored) > -1) {
      return;
    }
  }

  for (const part of content.split(';')) {
    check(sql);
  }
};

let check = function(text) {
  let error;
  let reference = parse(text).query;

  if (error = parse(deparse(reference)).error) {
    throw new Error(error + ":\n" + deparse(reference));
  }

  let deparsed = parse(deparse(reference)).query;

  let correct = pretty(clean(reference));
  let hopefully = pretty(clean(deparsed));


  let result = deparse(parse(text).query);

  let json1 = JSON.stringify(clean(parse(text).query));
  let json2 = JSON.stringify(clean(parse(result).query));

  let same = json1 === json2;

  // if not same
  //   log '----------------------------------'
  //   log "CORRECT"
  //   log text
  //   log '**********************************'
  //   log "RESULT"
  //   log result
  //   fs.writeFileSync('result.sql', result)
  //   log '----------------------------------'
  //   throw new Error('WRONG: ' + text)
  // else
  //   successCount++

  return json1.should.eq(json2);
};


let successCount = 0;

// scripts with this text are known to be broken
const SKIP = [
  // 'CREATE FOREIGN TABLE'
];

if (process.env.QUERY != null) {
  describe('parser', () =>
    it(`should parse ${process.env.QUERY}`, () => check(process.env.QUERY))
  );
} else {
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    describe('parser', function() {
      let content = fs.readFileSync(file).toString().trim();

      let parts = content.split(";");

      for (const sql of parts) {
        let closure = (sqlQuery, file) => {
          it(`should parse ${sqlQuery.trim()} from ${file}`, function() {
            try {
              let skipQuery = false;

              for (let j = 0; j < SKIP.length; j++) {
                skip = SKIP[j];
                if (sqlQuery.indexOf(skip) > -1) {
                  console.log('skipping', sqlQuery.trim());
                  skipQuery = true;
                }
              }

              if (!skipQuery) {
                var parsed = parse(sqlQuery);

                // Only SelectStmt's for now
                if (parsed.query && parsed.query[0] && (parsed.query[0].SelectStmt != null)) {
                  return check(sqlQuery);
                }
              }

            } catch (ex) {
              let unsupported = false;

              let unsupportedTypes = [
                'InsertStmt',
                'UpdateStmt',
                'DeleteStmt',
                'XmlExpr',
                'XmlSerialize'
              ];

              for (let k = 0; k < unsupportedTypes.length; k++) {
                let type = unsupportedTypes[k];
                if (search(parsed.query, type).length) {
                  unsupported = true;
                }
              }

              if (!unsupported) {
                log(file);
                log(sqlQuery);
                log('------------------------------------------');
                log(JSON.stringify(parsed));
                log(ex.stack);
                return process.exit(1);
              }
            }
          })
        }

        closure(sql, file);
      }
    });
  }
}
