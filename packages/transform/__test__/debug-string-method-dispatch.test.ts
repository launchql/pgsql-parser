import { Parser } from '@pgsql/parser';
import { V14ToV15Transformer } from '../src/transformers/v14-to-v15';

class VerboseStringTransformer extends V14ToV15Transformer {
  String(nodeData: any, context?: any): any {
    console.log(`=== V14ToV15Transformer.String method called ===`);
    console.log('Input nodeData:', JSON.stringify(nodeData, null, 2));
    
    const result = super.String(nodeData, context);
    
    console.log('String method result:', JSON.stringify(result, null, 2));
    return result;
  }

  transform(node: any, context?: any): any {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const keys = Object.keys(node);
      if (keys.length === 1) {
        const nodeType = keys[0];
        
        if (nodeType === 'String') {
          console.log(`=== BaseTransformer.transform processing String ===`);
          console.log('Input node:', JSON.stringify(node, null, 2));
          console.log('nodeData:', JSON.stringify(node[nodeType], null, 2));
          console.log('nodeData is object:', typeof node[nodeType] === 'object');
          console.log('nodeData is array:', Array.isArray(node[nodeType]));
          console.log('String method exists:', typeof (this as any)['String'] === 'function');
          
          if (node[nodeType] && typeof node[nodeType] === 'object' && !Array.isArray(node[nodeType])) {
            console.log('=== Conditions met, should call String method ===');
          } else {
            console.log('=== Conditions NOT met for String method call ===');
          }
        }
      }
    }
    
    return super.transform(node, context);
  }
}

describe('Debug String Method Dispatch', () => {
  it('should trace String method calls in V14ToV15Transformer', async () => {
    const sql = `SELECT guid_field FROM guid1 ORDER BY guid_field ASC`;
    
    console.log('=== Testing String Method Dispatch ===');
    console.log('SQL:', sql);
    
    const pg14Parser = new Parser(14);
    const pg14Ast = await pg14Parser.parse(sql) as any;
    
    console.log('\n=== Original PG14 String Structure ===');
    const stringNode = pg14Ast.stmts[0].stmt.SelectStmt.sortClause[0].SortBy.node.ColumnRef.fields[0].String;
    console.log('String structure:', JSON.stringify(stringNode, null, 2));
    
    console.log('\n=== Applying VerboseStringTransformer ===');
    const transformer = new VerboseStringTransformer();
    const transformedAst = transformer.transform(pg14Ast) as any;
    
    console.log('\n=== Final Result ===');
    const finalString = transformedAst.stmts[0].stmt.SelectStmt.sortClause[0].SortBy.node.ColumnRef.fields[0].String;
    console.log('Final String structure:', JSON.stringify(finalString, null, 2));
    
    expect(true).toBe(true);
  });
});
