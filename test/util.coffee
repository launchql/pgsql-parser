_ = require 'lodash'

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

module.exports = clean
