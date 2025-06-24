import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG16Node } from '../16/types';
import { Node as PG17Node } from '../17/types';

export class V16ToV17Transformer extends BaseTransformer {
  transform(node: any, context?: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 170004, // PG17 version
        stmts: node.stmts.map((stmt: any) => {
          if (stmt && typeof stmt === 'object' && 'stmt' in stmt) {
            return {
              ...stmt,
              stmt: this.transform(stmt.stmt, context)
            };
          }
          return this.transform(stmt, context);
        })
      };
    }
    
    return super.transform(node, context);
  }
}
