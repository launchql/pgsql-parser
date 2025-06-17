const RESERVED_WORDS = new Set([
  'all', 'analyse', 'analyze', 'and', 'any', 'array', 'as', 'asc', 'asymmetric',
  'authorization', 'binary', 'both', 'case', 'cast', 'check', 'collate', 'collation',
  'column', 'concurrently', 'constraint', 'create', 'cross', 'current_catalog',
  'current_date', 'current_role', 'current_schema', 'current_time', 'current_timestamp',
  'current_user', 'default', 'deferrable', 'desc', 'distinct', 'do', 'else', 'end',
  'except', 'false', 'fetch', 'for', 'foreign', 'freeze', 'from', 'full', 'grant',
  'group', 'having', 'ilike', 'in', 'initially', 'inner', 'intersect', 'into', 'is',
  'isnull', 'join', 'lateral', 'leading', 'left', 'like', 'limit', 'localtime',
  'localtimestamp', 'natural', 'not', 'notnull', 'null', 'offset', 'on', 'only',
  'or', 'order', 'outer', 'overlaps', 'placing', 'primary', 'references', 'returning',
  'right', 'select', 'session_user', 'similar', 'some', 'symmetric', 'table', 'tablesample',
  'then', 'to', 'trailing', 'true', 'union', 'unique', 'user', 'using', 'variadic',
  'verbose', 'when', 'where', 'window', 'with'
]);

export class QuoteUtils {
  static needsQuotes(value: string): boolean {
    if (!value || typeof value !== 'string') {
      return false;
    }

    const lowerValue = value.toLowerCase();
    
    if (RESERVED_WORDS.has(lowerValue)) {
      return true;
    }

    if (!/^[a-z_][a-z0-9_$]*$/i.test(value)) {
      return true;
    }

    if (value !== value.toLowerCase()) {
      return true;
    }

    return false;
  }

  static quote(value: any): any {
    if (value == null) {
      return null;
    }

    if (Array.isArray(value)) {
      return value.map(v => this.quote(v));
    }

    if (typeof value !== 'string') {
      return value;
    }

    if (this.needsQuotes(value)) {
      return `"${value}"`;
    }

    return value;
  }

  static escape(literal: string): string {
    return `'${literal.replace(/'/g, "''")}'`;
  }
}
