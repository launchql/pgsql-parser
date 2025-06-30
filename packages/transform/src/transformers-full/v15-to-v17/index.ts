import * as PG15 from '../../15/types';
import * as PG17 from '../../17/types';
import { V15ToV16Transformer } from '../../transformers/v15-to-v16';
import { V16ToV17Transformer } from '../../transformers/v16-to-v17';

/**
 * Direct transformer from PG15 to PG17
 * This transformer chains v15->v16 and v16->v17 transformations
 */
export class PG15ToPG17Transformer {
  private v15ToV16 = new V15ToV16Transformer();
  private v16ToV17 = new V16ToV17Transformer();

  /**
   * Transform a complete parse result from PG15 to PG17
   */
  transform(parseResult: PG15.ParseResult): PG17.ParseResult {
    if (!parseResult || !parseResult.stmts) {
      throw new Error('Invalid parse result');
    }

    const transformedStmts = parseResult.stmts.map((stmtWrapper: any) => {
      if (stmtWrapper.stmt) {
        // First transform v15 -> v16
        let transformedStmt = this.v15ToV16.transform(stmtWrapper.stmt, { parentNodeTypes: [] });
        // Then transform v16 -> v17
        transformedStmt = this.v16ToV17.transform(transformedStmt, { parentNodeTypes: [] });
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
   * Transform a single statement from PG15 to PG17
   */
  transformStatement(stmt: any): any {
    // First transform v15 -> v16
    let transformedStmt = this.v15ToV16.transform(stmt, { parentNodeTypes: [] });
    // Then transform v16 -> v17
    return this.v16ToV17.transform(transformedStmt, { parentNodeTypes: [] });
  }
}