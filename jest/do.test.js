const parser = require('../src');
import { cleanTree, cleanLines } from './utils';
const dosql = require('fs').readFileSync(__dirname + '/fixtures/do.sql').toString();

describe('do', () => {
  it('parse and deparse', () => {
    const tree = parser.parse(dosql);
    expect(tree).toMatchSnapshot();
    const sql = parser.deparse(tree.query);
    expect(cleanLines(sql)).toMatchSnapshot();
    expect(cleanTree(parser.parse(cleanLines(sql)))).toEqual(cleanTree(parser.parse(cleanLines(dosql))));
  });
});
