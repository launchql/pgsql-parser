{parse} = require 'pg-query-native'
{deparse} = require './deparser'

module.exports =
  parse: parse
  deparse: deparse
