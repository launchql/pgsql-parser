const { Parser } = require('@pgsql/parser');
const { ASTTransformer } = require('./dist/transformer');

class DebugTransformer extends ASTTransformer {
  A_Const(node, context) {
    console.log('=== A_Const Context Debug ===');
    console.log('Node:', JSON.stringify(node, null, 2));
    console.log('Context parentNodeTypes:', context.parentNodeTypes);
    console.log('Context path:', context.path);
    console.log('================================');
    
    return super.A_Const(node, context);
  }
}

async function debugContext() {
  const parser15 = new Parser(15);
  const transformer = new DebugTransformer();
  
  const testCases = [
    "insert into atacc2 (test2) values (-3)",
    "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)"
  ];
  
  console.log("=== DEBUGGING A_CONST CONTEXT ===");
  
  for (const sql of testCases) {
    console.log(`\n=== SQL: ${sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(sql);
      
      const astToTransform = JSON.parse(JSON.stringify(pg15Result));
      if (astToTransform.stmts && Array.isArray(astToTransform.stmts)) {
        astToTransform.stmts = astToTransform.stmts.map((stmtWrapper) => {
          if (stmtWrapper.stmt) {
            const transformedStmt = transformer.transform(stmtWrapper.stmt, 15, 16);
            return { ...stmtWrapper, stmt: transformedStmt };
          }
          return stmtWrapper;
        });
      }
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

debugContext();
