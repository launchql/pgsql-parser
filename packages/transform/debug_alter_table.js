const { Parser } = require('@pgsql/parser');
const { ASTTransformer } = require('./dist/transformer');

async function debugAlterTableTransformation() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const transformer = new ASTTransformer();
  
  const sql = "ALTER TABLE tmp ADD COLUMN j abstime[]";
  
  console.log("=== DEBUGGING ALTER TABLE TRANSFORMATION ===");
  console.log("SQL:", sql);
  
  try {
    const pg15Result = await parser15.parse(sql);
    console.log("\n=== PG15 PARSED RESULT ===");
    console.log(JSON.stringify(pg15Result, null, 2));
    
    const pg16Result = await parser16.parse(sql);
    console.log("\n=== PG16 PARSED RESULT ===");
    console.log(JSON.stringify(pg16Result, null, 2));
    
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
    astToTransform.version = pg16Result.version;
    
    console.log("\n=== TRANSFORMED RESULT ===");
    console.log(JSON.stringify(astToTransform, null, 2));
    
    // Focus on arrayBounds specifically
    const arrayBounds15 = pg15Result.stmts?.[0]?.stmt?.AlterTableStmt?.cmds?.[0]?.AlterTableCmd?.def?.ColumnDef?.typeName?.arrayBounds;
    const arrayBounds16 = pg16Result.stmts?.[0]?.stmt?.AlterTableStmt?.cmds?.[0]?.AlterTableCmd?.def?.ColumnDef?.typeName?.arrayBounds;
    const arrayBoundsTransformed = astToTransform.stmts?.[0]?.stmt?.AlterTableStmt?.cmds?.[0]?.AlterTableCmd?.def?.ColumnDef?.typeName?.arrayBounds;
    
    console.log("\n=== ARRAY BOUNDS COMPARISON ===");
    console.log("PG15 arrayBounds:", JSON.stringify(arrayBounds15, null, 2));
    console.log("PG16 arrayBounds:", JSON.stringify(arrayBounds16, null, 2));
    console.log("Transformed arrayBounds:", JSON.stringify(arrayBoundsTransformed, null, 2));
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

debugAlterTableTransformation();
