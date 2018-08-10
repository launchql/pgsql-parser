const parser = require('../src');

const json = require(__dirname + '/fixtures/policies.json');

describe('extensions', () => {
  it('deparse', () => {
    const sql = parser.deparse(json);
    expect(sql.trim()).toMatchSnapshot();
  });
});
