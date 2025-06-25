import { Parser } from '@pgsql/parser';
import { V14ToV15Transformer } from '../src/transformers/v14-to-v15';

class VerboseSortClauseTransformer extends V14ToV15Transformer {
  String(nodeData: any, context?: any): any {
    console.log(`=== String method called ===`);
    console.log('Input nodeData:', JSON.stringify(nodeData, null, 2));
    console.log('Stack trace:', new Error().stack?.split('\n').slice(1, 5).join('\n'));
    
    const result = super.String(nodeData, context);
    
    console.log('String method returning:', JSON.stringify(result, null, 2));
    return result;
  }

  SortBy(nodeData: any, context?: any): any {
    console.log(`=== SortBy method called ===`);
    console.log('Input nodeData:', JSON.stringify(nodeData, null, 2));
    
    const result = super.transform(nodeData, context);
    
    console.log('SortBy result:', JSON.stringify(result, null, 2));
    return result;
  }
}

describe('Debug SortClause String Transformation', () => {
  it('should trace String transformations in sortClause vs targetList', async () => {
    const sql = `SELECT guid_field FROM guid1 ORDER BY guid_field ASC`;
    
    console.log('=== Testing SortClause String Transformation ===');
    console.log('SQL:', sql);
    
    const pg14Parser = new Parser(14);
    const pg14Ast = await pg14Parser.parse(sql) as any;
    
    console.log('\n=== Original PG14 Structure ===');
    const targetListString = pg14Ast.stmts[0].stmt.SelectStmt.targetList[0].ResTarget.val.ColumnRef.fields[0].String;
    const sortClauseString = pg14Ast.stmts[0].stmt.SelectStmt.sortClause[0].SortBy.node.ColumnRef.fields[0].String;
    
    console.log('TargetList String:', JSON.stringify(targetListString, null, 2));
    console.log('SortClause String:', JSON.stringify(sortClauseString, null, 2));
    
    console.log('\n=== Applying VerboseSortClauseTransformer ===');
    const transformer = new VerboseSortClauseTransformer();
    const transformedAst = transformer.transform(pg14Ast) as any;
    
    console.log('\n=== Final Result ===');
    const finalTargetListString = transformedAst.stmts[0].stmt.SelectStmt.targetList[0].ResTarget.val.ColumnRef.fields[0].String;
    const finalSortClauseString = transformedAst.stmts[0].stmt.SelectStmt.sortClause[0].SortBy.node.ColumnRef.fields[0].String;
    
    console.log('Final TargetList String:', JSON.stringify(finalTargetListString, null, 2));
    console.log('Final SortClause String:', JSON.stringify(finalSortClauseString, null, 2));
    
    expect(true).toBe(true);
  });
});
