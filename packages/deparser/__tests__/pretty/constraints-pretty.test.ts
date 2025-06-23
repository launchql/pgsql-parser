import { deparseSync } from '../../src';
import { parse } from 'libpg-query';

describe('Pretty constraint formatting', () => {
  const foreignKeyConstraintSql = `ALTER TABLE products ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;`;
  
  const checkConstraintSql = `ALTER TABLE products ADD CONSTRAINT check_price CHECK (price > 0);`;

  const complexTableSql = `CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10,2) CHECK (total > 0),
    status VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`;

  it('should format foreign key constraint with pretty option enabled', async () => {
    const parsed = await parse(foreignKeyConstraintSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should maintain single-line format when pretty option disabled', async () => {
    const parsed = await parse(foreignKeyConstraintSql);
    const result = deparseSync(parsed, { pretty: false });
    expect(result).toMatchSnapshot();
  });

  it('should format check constraint with pretty option enabled', async () => {
    const parsed = await parse(checkConstraintSql);
    const result = deparseSync(parsed, { pretty: true });
    expect(result).toMatchSnapshot();
  });

  it('should format complex table with constraints with pretty option enabled', async () => {
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
    const parsed = await parse(foreignKeyConstraintSql);
    const result = deparseSync(parsed, { 
      pretty: true, 
      newline: '\r\n', 
      tab: '    ' 
    });
    expect(result).toMatchSnapshot();
  });
});
