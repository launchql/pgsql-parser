'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.walk = walk;
exports.first = first;
exports.all = all;
exports.tables = tables;
exports.byType = byType;
exports.clean = clean;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const EXIT = {};

function walk(obj, func) {
  if (_lodash2.default.isArray(obj)) {
    for (const item of obj) {
      if (func(obj, item) === EXIT) {
        return item;
      }
    }

    const results = [];

    for (const item of obj) {
      results.push(walk(item, func));
    }

    return results;
  } else if (_lodash2.default.isObject(obj)) {
    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (func(obj, key, value) === EXIT) {
        return obj;
      }
    }

    const results = [];

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      results.push(walk(value, func));
    }

    return results;
  }

  if (func(obj) === EXIT) {
    return obj;
  }

  return null;
}

function first(obj, func) {
  return walk(obj, (object, key, value) => {
    if (func(object, key, value)) {
      return EXIT;
    }

    return null;
  });
}

function all(obj, func) {
  const results = [];

  walk(obj, (object, key, value) => {
    if (func(object, key, value)) {
      return results.push(object);
    }

    return null;
  });

  return results;
}

function tables(query) {
  return all(query, (obj, key, value) => {
    return key === 'RangeVar';
  });
}

function byType(query, type) {
  return all(query, (object, key, value) => {
    return key === type;
  });
}

function clean(tree) {
  walk(tree, (object, key, value) => {
    if (_lodash2.default.isArray(object)) {
      return;
    }

    if (key === 'location') {
      delete object.location;
    }
  });

  return tree;
}
//# sourceMappingURL=utils.js.map