const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

async function debugInsertNegative() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const transformer = new V15ToV16Transformer();
  
  const sql = "insert into atacc2 (test2) values (-3)";
  
  console.log("=== DEBUGGING INSERT NEGATIVE INTEGER ===");
  console.log("SQL:", sql);
  
  try {
    const pg15Result = await parser15.parse(sql);
    console.log("\n=== PG15 PARSED RESULT ===");
    console.log(JSON.stringify(pg15Result, null, 2));
    
    const pg16Result = await parser16.parse(sql);
    console.log("\n=== PG16 PARSED RESULT ===");
    console.log(JSON.stringify(pg16Result, null, 2));
    
    const pg15AConst = findAConstInInsert(pg15Result);
    const pg16AConst = findAConstInInsert(pg16Result);
    
    console.log("\n=== PG15 A_Const ===");
    console.log(JSON.stringify(pg15AConst, null, 2));
    
    console.log("\n=== PG16 A_Const ===");
    console.log(JSON.stringify(pg16AConst, null, 2));
    
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
    astToTransform.version = pg16Result.version;
    
    const transformedAConst = findAConstInInsert(astToTransform);
    console.log("\n=== TRANSFORMED A_Const ===");
    console.log(JSON.stringify(transformedAConst, null, 2));
    
    console.log("\n=== COMPARISON ===");
    console.log("PG15 ival:", JSON.stringify(pg15AConst?.ival));
    console.log("PG16 ival:", JSON.stringify(pg16AConst?.ival));
    console.log("Transformed ival:", JSON.stringify(transformedAConst?.ival));
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function findAConstInInsert(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  try {
    return obj.stmts[0].stmt.InsertStmt.selectStmt.SelectStmt.valuesLists[0].List.items[0].A_Const;
  } catch (e) {
    return null;
  }
}

debugInsertNegative();
