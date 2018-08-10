const parser = require('../src');
import { cleanTree, cleanLines } from './utils';
const dosql = require('fs').readFileSync(__dirname + '/fixtures/custom.sql').toString();

describe('custom', () => {
  it('parse and deparse', () => {
    const tree = parser.parse(dosql);
    expect(tree).toMatchSnapshot();
    const sql = parser.deparse(tree.query);
    expect(sql).toMatchSnapshot();
    expect(cleanTree(parser.parse(sql))).toEqual(cleanTree(tree));
  });
});
