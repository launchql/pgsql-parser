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

  /**
   * Escapes a string value for use in E-prefixed string literals
   * Handles both backslashes and single quotes properly
   */
  static escapeEString(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "''");
  }

  /**
   * Formats a string as an E-prefixed string literal with proper escaping
   * This wraps the complete E-prefix logic including detection and formatting
   */
  static formatEString(value: string): string {
    const needsEscape = QuoteUtils.needsEscapePrefix(value);
    if (needsEscape) {
      const escapedValue = QuoteUtils.escapeEString(value);
      return `E'${escapedValue}'`;
    } else {
      return QuoteUtils.escape(value);
    }
  }

  /**
   * Determines if a string value needs E-prefix for escaped string literals
   * Detects backslash escape sequences that require E-prefix in PostgreSQL
   */
  static needsEscapePrefix(value: string): boolean {
    if (/^\\x[0-9a-fA-F]+$/i.test(value)) {
      return false;
    }
    
    if (/\\x[0-9a-fA-F]/.test(value) && !/\\[nrtbf\\']/.test(value)) {
      return false;
    }
    
    // Check for common backslash escape sequences that require E-prefix
    return /\\(?:[nrtbf\\']|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|[0-7]{1,3})/.test(value);
  }
}
