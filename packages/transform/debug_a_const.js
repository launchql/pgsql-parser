const { Parser } = require('@pgsql/parser');
const { ASTTransformer } = require('./dist/transformer');

async function debugAConstTransformation() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const transformer = new ASTTransformer();
  
  const testCases = [
    "insert into atacc2 (test2) values (-3)",
    "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)",
    "SELECT -1",
    "SELECT -3"
  ];
  
  console.log("=== DEBUGGING A_CONST TRANSFORMATION PATTERNS ===");
  
  for (const sql of testCases) {
    console.log(`\n=== SQL: ${sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(sql);
      const pg16Result = await parser16.parse(sql);
      
      const pg15AConsts = findAConstNodes(pg15Result);
      const pg16AConsts = findAConstNodes(pg16Result);
      
      console.log("PG15 A_Const nodes:", JSON.stringify(pg15AConsts, null, 2));
      console.log("PG16 A_Const nodes:", JSON.stringify(pg16AConsts, null, 2));
      
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
      
      const transformedAConsts = findAConstNodes(astToTransform);
      console.log("Transformed A_Const nodes:", JSON.stringify(transformedAConsts, null, 2));
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

function findAConstNodes(obj, path = []) {
  const results = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return results;
  }
  
  if (obj.A_Const) {
    results.push({
      path: path.concat(['A_Const']),
      node: obj.A_Const
    });
  }
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      results.push(...findAConstNodes(value, path.concat([key])));
    }
  }
  
  return results;
}

debugAConstTransformation();
