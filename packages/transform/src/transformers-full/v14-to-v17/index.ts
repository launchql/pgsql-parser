import * as PG14 from '../../14/types';
import * as PG17 from '../../17/types';
import { V14ToV15Transformer } from '../../transformers/v14-to-v15';
import { V15ToV16Transformer } from '../../transformers/v15-to-v16';
import { V16ToV17Transformer } from '../../transformers/v16-to-v17';

/**
 * Direct transformer from PG14 to PG17
 * This transformer chains v14->v15, v15->v16, and v16->v17 transformations
 */
export class PG14ToPG17Transformer {
  private v14ToV15 = new V14ToV15Transformer();
  private v15ToV16 = new V15ToV16Transformer();
  private v16ToV17 = new V16ToV17Transformer();

  /**
   * Transform a complete parse result from PG14 to PG17
   */
  transform(parseResult: PG14.ParseResult): PG17.ParseResult {
    if (!parseResult || !parseResult.stmts) {
      throw new Error('Invalid parse result');
    }

    const transformedStmts = parseResult.stmts.map((stmtWrapper: any) => {
      if (stmtWrapper.stmt) {
        // Chain transformations: v14 -> v15 -> v16 -> v17
        let transformedStmt = this.v14ToV15.transform(stmtWrapper.stmt, { parentNodeTypes: [] });
        transformedStmt = this.v15ToV16.transform(transformedStmt, { parentNodeTypes: [] });
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
   * Transform a single statement from PG14 to PG17
   */
  transformStatement(stmt: any): any {
    // Chain transformations: v14 -> v15 -> v16 -> v17
    let transformedStmt = this.v14ToV15.transform(stmt, { parentNodeTypes: [] });
    transformedStmt = this.v15ToV16.transform(transformedStmt, { parentNodeTypes: [] });
    return this.v16ToV17.transform(transformedStmt, { parentNodeTypes: [] });
  }
}