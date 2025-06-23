import { expectParseDeparse } from '../../test-utils';

describe('Pretty CREATE TABLE formatting', () => {
  const basicTableSql = `CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE);`;
  
  const complexTableSql = `CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10,2) CHECK (total > 0),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT now(),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );`;

  it('should format basic CREATE TABLE with pretty option enabled', async () => {
    const result = await expectParseDeparse(basicTableSql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const result = await expectParseDeparse(basicTableSql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format complex CREATE TABLE with pretty option enabled', async () => {
    const result = await expectParseDeparse(complexTableSql, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format for complex table when pretty disabled', async () => {
    const result = await expectParseDeparse(complexTableSql, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should use custom newline and tab characters in pretty mode', async () => {
    const result = await expectParseDeparse(basicTableSql, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });
});
