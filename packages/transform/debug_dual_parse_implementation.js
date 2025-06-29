const { Parser } = require('@pgsql/parser');

async function testDualParseImplementation() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  
  console.log("=== DUAL-PARSE IMPLEMENTATION TEST ===");
  console.log("Testing the approach for detecting when empty ival objects need transformation\n");
  
  const testCases = [
    { sql: "insert into atacc2 (test2) values (-3)", expected: "should transform" },
    { sql: "insert into atacc2 (test2) values (0)", expected: "should NOT transform" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -1)", expected: "should transform" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)", expected: "should NOT transform" }
  ];
  
  for (const testCase of testCases) {
    console.log(`=== SQL: ${testCase.sql} ===`);
    console.log(`Expected: ${testCase.expected}`);
    
    try {
      const pg15Result = await parser15.parse(testCase.sql);
      const pg16Result = await parser16.parse(testCase.sql);
      
      const pg15AConst = findAConstInAST(pg15Result);
      const pg16AConst = findAConstInAST(pg16Result);
      
      if (pg15AConst && pg16AConst) {
        const pg15IsEmpty = pg15AConst.ival && Object.keys(pg15AConst.ival).length === 0;
        const pg16HasNested = pg16AConst.ival && typeof pg16AConst.ival.ival === 'number';
        
        console.log("PG15 ival:", JSON.stringify(pg15AConst.ival));
        console.log("PG16 ival:", JSON.stringify(pg16AConst.ival));
        console.log("PG15 is empty:", pg15IsEmpty);
        console.log("PG16 has nested:", pg16HasNested);
        
        if (pg15IsEmpty && pg16HasNested) {
          console.log(`✅ TRANSFORM NEEDED: {} -> {ival: ${pg16AConst.ival.ival}}`);
        } else if (pg15IsEmpty && !pg16HasNested) {
          console.log("✅ KEEP EMPTY: {} -> {}");
        } else {
          console.log("ℹ️  No transformation needed (not empty ival case)");
        }
        
        console.log("");
      }
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  console.log("=== IMPLEMENTATION STRATEGY ===");
  console.log("1. Create helper method shouldTransformEmptyIval(sql) that:");
  console.log("   - Parses SQL with both PG15 and PG16");
  console.log("   - Compares A_Const ival structures");
  console.log("   - Returns transformation target if needed, null otherwise");
  console.log("2. Use this in A_Const method when encountering empty ival objects");
  console.log("3. Cache results to avoid re-parsing same SQL multiple times");
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

testDualParseImplementation();
