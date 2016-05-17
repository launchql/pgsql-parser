chai = require('chai')
chai.should()
require('babel-core/register')()

_ = require 'lodash'

fs = require 'fs'
glob = require 'glob'
path = require 'path'

PgQuery = require '../src'

parse = PgQuery.parse
deparse = PgQuery.Deparser.deparse

pattern =
  if process.env.FILTER
    '*' + process.env.FILTER + '*.sql'
  else
    '*.sql'

files = glob.sync('./test/fixtures/' + pattern)
files = files.concat(glob.sync('./test/fixtures/upstream/' + pattern))

pretty = (obj) -> JSON.stringify(obj, null, 2)

log = (msg) ->
  fs.writeSync(1, "#{msg}\n")
  fs.fsyncSync(1)

walk = (obj, func) ->
  if _.isArray(obj)
    func(obj, o) for o in obj
    walk(o, func) for o in obj
  else if _.isObject(obj)
    func(obj, k, v) for k, v of obj
    walk(v, func) for k, v of obj
  else
    func(obj)

clean = (tree) ->
  walk tree, (obj, k, v) ->
    return if _.isArray(obj)
    if k is 'location'
      delete obj.location
  tree

search = (obj, key) ->
  needles = []

  walk obj, (obj, k, v) ->
    return if _.isArray(obj)
    needles.push(obj) if k is key

  needles

# these are known to not work
skip = [ 'create', 'begin;', 'notify', 'listen', 'unlisten' ]

checkFile = (filePath) ->
  content = fs.readFileSync(filePath).toString().trim()

  for ignored in skip
    if content.toLowerCase().indexOf(ignored) > -1
      return

  for sql in content.split(";")
    check(sql)


check = (text) ->
  reference = parse(text).query

  if error = parse(deparse(reference)).error
    throw new Error(error + ":\n" + deparse(reference))

  deparsed = parse(deparse(reference)).query

  correct = pretty(clean(reference))
  hopefully = pretty(clean(deparsed))


  result = deparse(parse(text).query)

  json1 = JSON.stringify(clean(parse(text).query))
  json2 = JSON.stringify(clean(parse(result).query))

  same = json1 is json2

  # if not same
  #   log '----------------------------------'
  #   log "CORRECT"
  #   log text
  #   log '**********************************'
  #   log "RESULT"
  #   log result
  #   fs.writeFileSync('result.sql', result)
  #   log '----------------------------------'
  #   throw new Error('WRONG: ' + text)
  # else
  #   successCount++

  json1.should.eq(json2)


successCount = 0

# scripts with this text are known to be broken
SKIP = [
  'CREATE FOREIGN TABLE'
]

if process.env.QUERY?
  describe 'parser', ->
    it "should parse #{process.env.QUERY}", ->
      check(process.env.QUERY)
else
  for file in files
    describe 'parser', ->
      content = fs.readFileSync(file).toString().trim()

      for sql in content.split(";")
        closure = (sqlQuery, file) ->
          it "should parse #{sqlQuery.trim()} from #{file}", ->
            try
              skipQuery = false

              for skip in SKIP
                if sqlQuery.indexOf(skip) > -1
                  console.log('skipping', sqlQuery.trim())
                  skipQuery = true

              unless skipQuery
                parsed = parse(sqlQuery)

                # Only SelectStmt's for now
                if parsed.query and parsed.query[0]?.SelectStmt?
                  check(sqlQuery)

            catch ex
              unsupported = false

              unsupportedTypes = [
                'InsertStmt',
                'UpdateStmt',
                'DeleteStmt',
                'XmlExpr',
                'XmlSerialize'
              ]

              for type in unsupportedTypes
                if search(parsed.query, type).length
                  unsupported = true

              unless unsupported
                log file
                log sqlQuery
                log '------------------------------------------'
                log JSON.stringify(parsed)
                log ex.stack
                process.exit(1)

        closure(sql, file)
