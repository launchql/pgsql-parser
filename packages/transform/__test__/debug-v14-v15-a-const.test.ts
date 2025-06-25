import { Parser } from '@pgsql/parser';
import { V14ToV15Transformer } from '../src/transformers/v14-to-v15';

class VerboseV14ToV15Transformer extends V14ToV15Transformer {
  A_Const(nodeData: any, context?: any): any {
    console.log(`=== V14ToV15Transformer.A_Const method called ===`);
    console.log('Input nodeData:', JSON.stringify(nodeData, null, 2));
    
    const result = super.A_Const(nodeData, context);
    
    console.log('A_Const result:', JSON.stringify(result, null, 2));
    return result;
  }

  transform(node: any, context?: any): any {
    if (node && typeof node === 'object' && !Array.isArray(node)) {
      const keys = Object.keys(node);
      if (keys.length === 1) {
        const nodeType = keys[0];
        console.log(`=== BaseTransformer.transform processing ${nodeType} ===`);
        
        if (nodeType === 'A_Const') {
          console.log('Input node:', JSON.stringify(node, null, 2));
          console.log('nodeData:', JSON.stringify(node[nodeType], null, 2));
          console.log('nodeData is object:', typeof node[nodeType] === 'object');
          console.log('nodeData is array:', Array.isArray(node[nodeType]));
          console.log('A_Const method exists:', typeof (this as any)['A_Const'] === 'function');
          
          if (node[nodeType] && typeof node[nodeType] === 'object' && !Array.isArray(node[nodeType])) {
            console.log('=== Conditions met, should call A_Const method ===');
          } else {
            console.log('=== Conditions NOT met for A_Const method call ===');
          }
        }
      }
    }
    
    return super.transform(node, context);
  }
}

describe('Debug V14ToV15 A_Const Method Dispatch', () => {
  it('should trace A_Const method calls in V14ToV15Transformer', async () => {
    const sql = `INSERT INTO TIMESTAMP_TBL VALUES ('now')`;
    
    console.log('=== Testing V14ToV15 A_Const Method Dispatch ===');
    console.log('SQL:', sql);
    
    const pg14Parser = new Parser(14);
    const pg14Ast = await pg14Parser.parse(sql) as any;
    
    console.log('\n=== Original PG14 A_Const Structure ===');
    const aConstNode = pg14Ast.stmts[0].stmt.InsertStmt.selectStmt.SelectStmt.valuesLists[0].List.items[0].A_Const;
    console.log('A_Const structure:', JSON.stringify(aConstNode, null, 2));
    
    console.log('\n=== Applying VerboseV14ToV15Transformer ===');
    const transformer = new VerboseV14ToV15Transformer();
    const transformedAst = transformer.transform(pg14Ast) as any;
    
    console.log('\n=== Final Result ===');
    const finalAConst = transformedAst.stmts[0].stmt.InsertStmt.selectStmt.SelectStmt.valuesLists[0].List.items[0].A_Const;
    console.log('Final A_Const structure:', JSON.stringify(finalAConst, null, 2));
    
    expect(true).toBe(true);
  });
});
