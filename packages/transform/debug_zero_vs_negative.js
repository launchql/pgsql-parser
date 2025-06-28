const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

async function debugZeroVsNegative() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const transformer = new V15ToV16Transformer();
  
  const testCases = [
    "insert into atacc2 (test2) values (-3)",  // negative integer
    "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)"  // zero
  ];
  
  console.log("=== DEBUGGING ZERO VS NEGATIVE INTEGER ===");
  
  for (const sql of testCases) {
    console.log(`\n=== SQL: ${sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(sql);
      const pg16Result = await parser16.parse(sql);
      
      const pg15AConst = findAConstInAST(pg15Result);
      const pg16AConst = findAConstInAST(pg16Result);
      
      console.log("PG15 A_Const ival:", JSON.stringify(pg15AConst?.ival));
      console.log("PG16 A_Const ival:", JSON.stringify(pg16AConst?.ival));
      
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
      
      const transformedAConst = findAConstInAST(astToTransform);
      console.log("Transformed ival:", JSON.stringify(transformedAConst?.ival));
      
      console.log("Should transform?", pg16AConst?.ival && Object.keys(pg16AConst.ival).length > 0 ? "YES" : "NO");
      
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

debugZeroVsNegative();
