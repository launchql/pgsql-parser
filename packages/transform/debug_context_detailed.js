const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

class DebugTransformer extends V15ToV16Transformer {
  Integer(node, context) {
    console.log('=== Integer method called ===');
    console.log('Node:', JSON.stringify(node, null, 2));
    console.log('Context parentNodeTypes:', context.parentNodeTypes);
    console.log('Context path:', context.path);
    console.log('Object.keys(node).length:', Object.keys(node).length);
    console.log('Is empty?', Object.keys(node).length === 0);
    console.log('Has TypeName parent?', context.parentNodeTypes.includes('TypeName'));
    console.log('Has A_Const parent?', context.parentNodeTypes.includes('A_Const'));
    
    const result = super.Integer(node, context);
    console.log('Result:', JSON.stringify(result, null, 2));
    console.log('================================');
    
    return result;
  }
  
  A_Const(node, context) {
    console.log('=== A_Const method called ===');
    console.log('Node:', JSON.stringify(node, null, 2));
    console.log('Context parentNodeTypes:', context.parentNodeTypes);
    console.log('Context path:', context.path);
    
    const result = super.A_Const(node, context);
    console.log('A_Const result:', JSON.stringify(result, null, 2));
    console.log('================================');
    
    return result;
  }
}

async function debugContextDetailed() {
  const parser15 = new Parser(15);
  const transformer = new DebugTransformer();
  
  const sql = "insert into atacc2 (test2) values (-3)";
  
  console.log("=== DEBUGGING DETAILED CONTEXT ===");
  console.log("SQL:", sql);
  
  try {
    const pg15Result = await parser15.parse(sql);
    
    console.log("\n=== STARTING TRANSFORMATION ===");
    const astToTransform = JSON.parse(JSON.stringify(pg15Result));
    if (astToTransform.stmts && Array.isArray(astToTransform.stmts)) {
      astToTransform.stmts = astToTransform.stmts.map((stmtWrapper) => {
        if (stmtWrapper.stmt) {
          const transformedStmt = transformer.transform(stmtWrapper.stmt, { parentNodeTypes: [] });
          return { ...stmtWrapper, stmt: transformedStmt };
        }
        return stmtWrapper;
      });
    }
    
    console.log("\n=== TRANSFORMATION COMPLETE ===");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

debugContextDetailed();
