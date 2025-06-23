import { deparseSync } from '../../src';
import { parse } from 'libpg-query';

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
    const parsed = await parse(basicTableSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const parsed = await parse(basicTableSql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format complex CREATE TABLE with pretty option enabled', async () => {
    const parsed = await parse(complexTableSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format for complex table when pretty disabled', async () => {
    const parsed = await parse(complexTableSql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should use custom newline and tab characters in pretty mode', async () => {
    const parsed = await parse(basicTableSql);
    const result = deparseSync(parsed, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });
});
