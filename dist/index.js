'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deparser = exports.clean = exports.byType = exports.tables = exports.all = exports.first = exports.walk = exports.deparse = exports.parse = undefined;

var _pgQueryNative = require('pg-query-native');

var _deparser = require('./deparser');

var _deparser2 = _interopRequireDefault(_deparser);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const deparse = _deparser2.default.deparse;

exports.parse = _pgQueryNative.parse;
exports.deparse = deparse;
exports.walk = _utils.walk;
exports.first = _utils.first;
exports.all = _utils.all;
exports.tables = _utils.tables;
exports.byType = _utils.byType;
exports.clean = _utils.clean;
exports.Deparser = _deparser2.default;
//# sourceMappingURL=index.js.map