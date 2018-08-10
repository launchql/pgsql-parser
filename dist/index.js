'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deparser = exports.verify = exports.clean = exports.byType = exports.tables = exports.all = exports.first = exports.walk = exports.deparse = exports.parse = undefined;

var _pgQueryNativeLatest = require('pg-query-native-latest');

var _deparser = require('./deparser');

var _deparser2 = _interopRequireDefault(_deparser);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const deparse = _deparser2.default.deparse;
const verify = query => {
  const result = deparse((0, _pgQueryNativeLatest.parse)(query).query);

  const json1 = (0, _utils.clean)((0, _pgQueryNativeLatest.parse)(query).query);
  const json2 = (0, _utils.clean)((0, _pgQueryNativeLatest.parse)(result).query);

  return JSON.stringify(json1) === JSON.stringify(json2);
};

exports.parse = _pgQueryNativeLatest.parse;
exports.deparse = deparse;
exports.walk = _utils.walk;
exports.first = _utils.first;
exports.all = _utils.all;
exports.tables = _utils.tables;
exports.byType = _utils.byType;
exports.clean = _utils.clean;
exports.verify = verify;
exports.Deparser = _deparser2.default;
//# sourceMappingURL=index.js.map