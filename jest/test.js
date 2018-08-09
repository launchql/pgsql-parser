const parser = require('../src');

const dosql = `
  DO $$
  BEGIN
      IF NOT EXISTS (
              SELECT
                  1
              FROM
                  pg_roles
              WHERE
                  rolname = 'administrator') THEN
              CREATE ROLE administrator;
              COMMENT ON ROLE administrator IS 'Administration group';
      END IF;
  END $$;
`;

describe('first', () => {
  it('parse and deparse', () => {
    const tree = parser.parse(dosql);
    expect(tree).toMatchSnapshot();
    const sql = parser.deparse(tree.query);
    expect(sql.trim()).toMatchSnapshot();
    expect(sql.trim()).toEqual(dosql.trim());
  });
});
