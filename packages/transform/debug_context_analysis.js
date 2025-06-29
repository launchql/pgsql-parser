const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

class ContextAnalysisTransformer extends V15ToV16Transformer {
  A_Const(node, context) {
    console.log('=== A_Const Context Analysis ===');
    console.log('Input node:', JSON.stringify(node, null, 2));
    console.log('Context path:', context.path);
    console.log('Parent types:', context.parentNodeTypes);
    console.log('Context keys:', Object.keys(context));
    
    const hasInsertContext = context.parentNodeTypes.includes('InsertStmt');
    const hasConstraintContext = context.parentNodeTypes.includes('Constraint');
    const hasExprContext = context.parentNodeTypes.includes('A_Expr');
    
    console.log('Insert context:', hasInsertContext);
    console.log('Constraint context:', hasConstraintContext);
    console.log('Expression context:', hasExprContext);
    
    const result = super.A_Const(node, context);
    console.log('A_Const result:', JSON.stringify(result, null, 2));
    console.log('================================');
    
    return result;
  }
}

async function analyzeContext() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const transformer = new ContextAnalysisTransformer();
  
  const testCases = [
    {
      name: "Negative integer in INSERT",
      sql: "insert into atacc2 (test2) values (-3)"
    },
    {
      name: "Zero in constraint",
      sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)"
    },
    {
      name: "Positive integer",
      sql: "insert into atacc2 (test2) values (5)"
    }
  ];
  
  console.log("=== CONTEXT ANALYSIS FOR A_CONST TRANSFORMATION ===");
  
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.name}: ${testCase.sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(testCase.sql);
      const pg16Result = await parser16.parse(testCase.sql);
      
      console.log("\n--- PG16 Expected Result ---");
      const pg16AConst = findAConstInAST(pg16Result);
      console.log("PG16 A_Const ival:", JSON.stringify(pg16AConst?.ival));
      
      console.log("\n--- Transformation Analysis ---");
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
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

function findAConstInAST(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  if (obj.A_Const) return obj.A_Const;
  
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findAConstInAST(obj[key]);
      if (result) return result;
    }
  }
  
  return null;
}

analyzeContext();
