const parser = require('../src');
import { cleanTree, cleanLines } from './utils';
const dosql = require('fs').readFileSync(__dirname + '/fixtures/policies.sql').toString();

describe('policies', () => {
  it('parse and deparse', () => {
    const tree = parser.parse(dosql);
    expect(tree).toMatchSnapshot();
    const sql = parser.deparse(tree.query);
    expect(cleanLines(sql)).toMatchSnapshot();
    expect(cleanTree(parser.parse(sql))).toEqual(cleanTree(tree));
  });
});
