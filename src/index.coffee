{parse} = require 'pg-query-native'
{deparse} = require './deparser'
{walk, all, first, tables, byType} = require './utils'

module.exports =
  parse: parse
  deparse: deparse
  walk: walk
  first: first
  all: all
  tables: tables
  byType: byType
