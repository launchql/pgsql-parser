'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deparser = exports.verify = exports.clean = exports.byType = exports.tables = exports.all = exports.first = exports.walk = exports.deparse = exports.parse = undefined;

var _deparser = require('./deparser');

var _deparser2 = _interopRequireDefault(_deparser);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parse = require('pg-plpgsql-query-native').parseQuerySync;


const deparse = _deparser2.default.deparse;
const verify = query => {
  const result = deparse(parse(query));

  const json1 = (0, _utils.clean)(parse(query));
  const json2 = (0, _utils.clean)(parse(result));

  return JSON.stringify(json1) === JSON.stringify(json2);
};

exports.parse = parse;
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