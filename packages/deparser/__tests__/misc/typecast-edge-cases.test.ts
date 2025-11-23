import { expectParseDeparse } from '../../test-utils';

describe('TypeCast with negative numbers', () => {
  it('should handle negative integer with CAST syntax', async () => {
    const sql = `SELECT -1::integer`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle parenthesized negative integer', async () => {
    const sql = `SELECT (-1)::integer`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle negative float with CAST syntax', async () => {
    const sql = `SELECT -1.5::numeric`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle parenthesized negative float', async () => {
    const sql = `SELECT (-1.5)::numeric`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle negative bigint', async () => {
    const sql = `SELECT -9223372036854775808::bigint`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with complex expressions', () => {
  it('should handle arithmetic expression with CAST syntax', async () => {
    const sql = `SELECT (1 + 2)::integer`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle subtraction expression', async () => {
    const sql = `SELECT (a - b)::integer FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle CASE expression with CAST syntax', async () => {
    const sql = `SELECT (CASE WHEN a > 0 THEN 1 ELSE 2 END)::integer FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle boolean expression', async () => {
    const sql = `SELECT (a IS NULL)::boolean FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle comparison expression', async () => {
    const sql = `SELECT (a > b)::boolean FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with function calls', () => {
  it('should handle function call with :: syntax and parentheses', async () => {
    const sql = `SELECT substring('test', 1, 2)::text`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle qualified function call', async () => {
    const sql = `SELECT pg_catalog.substring('test', 1, 2)::text`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle aggregate function', async () => {
    const sql = `SELECT sum(x)::numeric FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle nested function calls', async () => {
    const sql = `SELECT upper(lower('TEST'))::text`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with pg_catalog.bpchar', () => {
  it('should preserve CAST syntax for qualified bpchar', async () => {
    const sql = `SELECT 'x'::pg_catalog.bpchar`;
    const result = await expectParseDeparse(sql);
    // Should use CAST() syntax for round-trip fidelity
    expect(result).toBe(`SELECT CAST('x' AS pg_catalog.bpchar)`);
  });

  it('should use :: syntax for unqualified bpchar', async () => {
    const sql = `SELECT 'x'::bpchar`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT 'x'::bpchar`);
  });

  it('should handle bpchar with length modifier', async () => {
    const sql = `SELECT 'hello'::bpchar(10)`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with string literals containing special characters', () => {
  it('should handle string literal with parenthesis', async () => {
    const sql = `SELECT '('::text`;
    const result = await expectParseDeparse(sql);
    // Should use :: syntax (not CAST) - improvement over old string-based heuristic
    expect(result).toBe(`SELECT '('::text`);
  });

  it('should handle string literal starting with minus', async () => {
    const sql = `SELECT '-hello'::text`;
    const result = await expectParseDeparse(sql);
    // Should use :: syntax (not CAST) - improvement over old string-based heuristic
    expect(result).toBe(`SELECT '-hello'::text`);
  });

  it('should handle string literal with multiple special chars', async () => {
    const sql = `SELECT '(-)'::text`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT '(-)'::text`);
  });

  it('should handle empty string', async () => {
    const sql = `SELECT ''::text`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT ''::text`);
  });
});

describe('TypeCast with simple constants', () => {
  it('should handle positive integer with :: syntax', async () => {
    const sql = `SELECT 123::integer`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT 123::integer`);
  });

  it('should handle positive float with :: syntax', async () => {
    const sql = `SELECT 3.14::numeric`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT 3.14::numeric`);
  });

  it('should handle boolean true', async () => {
    const sql = `SELECT true::boolean`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT TRUE::boolean`);
  });

  it('should handle boolean false', async () => {
    const sql = `SELECT false::boolean`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT FALSE::boolean`);
  });

  it('should handle NULL cast', async () => {
    const sql = `SELECT NULL::integer`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with column references', () => {
  it('should handle simple column reference with :: syntax', async () => {
    const sql = `SELECT a::integer FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT a::integer FROM t`);
  });

  it('should handle qualified column reference', async () => {
    const sql = `SELECT t.a::integer FROM t`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT t.a::integer FROM t`);
  });

  it('should handle fully qualified column reference', async () => {
    const sql = `SELECT schema.t.a::integer FROM schema.t`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with pg_catalog types', () => {
  it('should handle pg_catalog.int4 with :: syntax', async () => {
    const sql = `SELECT 123::pg_catalog.int4`;
    const result = await expectParseDeparse(sql);
    // Should strip pg_catalog prefix and use :: syntax
    expect(result).toBe(`SELECT 123::int4`);
  });

  it('should handle pg_catalog.varchar', async () => {
    const sql = `SELECT 'hello'::pg_catalog.varchar`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT 'hello'::varchar`);
  });

  it('should handle pg_catalog.numeric', async () => {
    const sql = `SELECT 3.14::pg_catalog.numeric`;
    const result = await expectParseDeparse(sql);
    expect(result).toBe(`SELECT 3.14::numeric`);
  });
});

describe('TypeCast with arrays', () => {
  it('should handle array literal cast', async () => {
    const sql = `SELECT ARRAY[1, 2, 3]::integer[]`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle array string literal cast', async () => {
    const sql = `SELECT '{1,2,3}'::integer[]`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});

describe('TypeCast with ROW expressions', () => {
  it('should handle ROW cast', async () => {
    const sql = `SELECT ROW(1, 2)::record`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });

  it('should handle implicit row cast', async () => {
    const sql = `SELECT (1, 2)::record`;
    const result = await expectParseDeparse(sql);
    expect(result).toMatchSnapshot();
  });
});
