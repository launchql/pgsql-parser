const { Parser } = require('@pgsql/parser');
const { ASTTransformer } = require('./dist/transformer');

class DebugTransformer extends ASTTransformer {
  transform(node, fromVersion, toVersion) {
    console.log('=== Transform called ===');
    console.log('Node type:', this.getNodeType(node));
    console.log('Node data:', JSON.stringify(this.getNodeData(node), null, 2));
    console.log('========================');
    
    return super.transform(node, fromVersion, toVersion);
  }
  
  A_Const(node, context) {
    console.log('=== A_Const called ===');
    console.log('Node:', JSON.stringify(node, null, 2));
    console.log('Context path:', context.path);
    console.log('Parent types:', context.parentNodeTypes);
    console.log('========================');
    
    return super.A_Const(node, context);
  }
  
  Integer(node, context) {
    console.log('=== Integer called ===');
    console.log('Node:', JSON.stringify(node, null, 2));
    console.log('Context path:', context.path);
    console.log('Parent types:', context.parentNodeTypes);
    console.log('========================');
    
    return super.Integer(node, context);
  }
}

async function debugTransformationFlow() {
  const parser15 = new Parser(15);
  const transformer = new DebugTransformer();
  
  const sql = "insert into atacc2 (test2) values (-3)";
  
  console.log("=== DEBUGGING TRANSFORMATION FLOW ===");
  console.log("SQL:", sql);
  
  try {
    const pg15Result = await parser15.parse(sql);
    
    console.log("\n=== STARTING TRANSFORMATION ===");
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
    
    console.log("\n=== TRANSFORMATION COMPLETE ===");
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

debugTransformationFlow();
