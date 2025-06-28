const { Parser } = require('@pgsql/parser');

function testDualParseApproach() {
  console.log("=== TESTING DUAL-PARSE APPROACH ===");
  
  try {
    const parser15 = new Parser(15);
    const parser16 = new Parser(16);
    
    console.log("Parsers created successfully");
    
    const simpleSQL = "SELECT 1";
    console.log(`Testing simple SQL: ${simpleSQL}`);
    
    const simple15 = parser15.parse(simpleSQL);
    const simple16 = parser16.parse(simpleSQL);
    
    console.log("Simple PG15 result keys:", Object.keys(simple15));
    console.log("Simple PG16 result keys:", Object.keys(simple16));
    
    const testSQL = "INSERT INTO test VALUES (-3)";
    console.log(`\nTesting negative integer SQL: ${testSQL}`);
    
    const pg15Result = parser15.parse(testSQL);
    const pg16Result = parser16.parse(testSQL);
    
    console.log("PG15 result keys:", Object.keys(pg15Result));
    console.log("PG16 result keys:", Object.keys(pg16Result));
    
    if (Object.keys(pg15Result).length > 0 && Object.keys(pg16Result).length > 0) {
      console.log("PG15 result:", JSON.stringify(pg15Result, null, 2));
      console.log("PG16 result:", JSON.stringify(pg16Result, null, 2));
      
      const pg15AConst = findAConstInAST(pg15Result);
      const pg16AConst = findAConstInAST(pg16Result);
      
      console.log("PG15 A_Const:", JSON.stringify(pg15AConst, null, 2));
      console.log("PG16 A_Const:", JSON.stringify(pg16AConst, null, 2));
    } else {
      console.log("❌ FAILED: Parsers returning empty objects");
    }
    
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    console.error("Stack:", error.stack);
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

testDualParseApproach();
