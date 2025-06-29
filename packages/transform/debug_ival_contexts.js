const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

class IvalContextAnalyzer extends V15ToV16Transformer {
  A_Const(node, context) {
    if (node.ival !== undefined && typeof node.ival === 'object' && Object.keys(node.ival).length === 0) {
      console.log('=== EMPTY IVAL CONTEXT ===');
      console.log('Context path:', context.path);
      console.log('Parent types:', context.parentNodeTypes);
      console.log('Full node:', JSON.stringify(node, null, 2));
      console.log('========================');
    }
    
    return super.A_Const(node, context);
  }
}

async function analyzeIvalContexts() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const analyzer = new IvalContextAnalyzer();
  
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
    },
    {
      name: "Zero in INSERT",
      sql: "insert into atacc2 (test2) values (0)"
    },
    {
      name: "Negative in constraint",
      sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -1)"
    }
  ];
  
  console.log("=== ANALYZING EMPTY IVAL CONTEXTS ===");
  
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.name}: ${testCase.sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(testCase.sql);
      const pg16Result = await parser16.parse(testCase.sql);
      
      console.log("\n--- PG15 vs PG16 Comparison ---");
      const pg15AConst = findAConstInAST(pg15Result);
      const pg16AConst = findAConstInAST(pg16Result);
      
      if (pg15AConst && pg16AConst) {
        console.log("PG15 ival:", JSON.stringify(pg15AConst.ival));
        console.log("PG16 ival:", JSON.stringify(pg16AConst.ival));
        console.log("Should transform?", JSON.stringify(pg15AConst.ival) !== JSON.stringify(pg16AConst.ival));
      }
      
      console.log("\n--- Transformation Analysis ---");
      const astToTransform = JSON.parse(JSON.stringify(pg15Result));
      if (astToTransform.stmts && Array.isArray(astToTransform.stmts)) {
        astToTransform.stmts = astToTransform.stmts.map((stmtWrapper) => {
          if (stmtWrapper.stmt) {
            const transformedStmt = analyzer.transform(stmtWrapper.stmt, { parentNodeTypes: [] });
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

analyzeIvalContexts();
