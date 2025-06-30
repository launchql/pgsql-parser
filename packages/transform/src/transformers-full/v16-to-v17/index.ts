import * as V16Types from '../../16/types';
import * as V17Types from '../../17/types';
import { V16ToV17Transformer } from '../../transformers/v16-to-v17';

/**
 * Direct transformer from PG16 to PG17
 * This transformer only includes the necessary code for v16->v17 transformation
 */
export class PG16ToPG17Transformer {
  private transformer = new V16ToV17Transformer();

  /**
   * Transform a complete parse result from PG16 to PG17
   */
  transform(parseResult: V16Types.ParseResult): V17Types.ParseResult {
    if (!parseResult || !parseResult.stmts) {
      throw new Error('Invalid parse result');
    }

    const transformedStmts = parseResult.stmts.map((stmtWrapper: any) => {
      if (stmtWrapper.stmt) {
        const transformedStmt = this.transformer.transform(stmtWrapper.stmt, { parentNodeTypes: [] });
        return { ...stmtWrapper, stmt: transformedStmt };
      }
      return stmtWrapper;
    });

    return {
      ...parseResult,
      version: 170004, // PG17 version
      stmts: transformedStmts
    };
  }

  /**
   * Transform a single statement from PG16 to PG17
   */
  transformStatement(stmt: any): any {
    return this.transformer.transform(stmt, { parentNodeTypes: [] });
  }
}

// Export the transformer instance for convenience
export const pg16ToPg17Transformer = new PG16ToPG17Transformer();

// Re-export types for convenience
export { V16Types, V17Types };