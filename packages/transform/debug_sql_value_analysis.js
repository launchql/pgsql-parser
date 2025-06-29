const { Parser } = require('@pgsql/parser');

async function analyzeSQLValues() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  
  const testCases = [
    { sql: "insert into atacc2 (test2) values (-3)", expectedValue: -3 },
    { sql: "insert into atacc2 (test2) values (0)", expectedValue: 0 },
    { sql: "insert into atacc2 (test2) values (5)", expectedValue: 5 },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)", expectedValue: 0 },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -1)", expectedValue: -1 },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -5)", expectedValue: -5 },
  ];
  
  console.log("=== SQL VALUE ANALYSIS ===");
  
  for (const testCase of testCases) {
    console.log(`\n=== SQL: ${testCase.sql} ===`);
    console.log(`Expected value: ${testCase.expectedValue}`);
    
    try {
      const pg15Result = await parser15.parse(testCase.sql);
      const pg16Result = await parser16.parse(testCase.sql);
      
      const pg15AConst = findAConstInAST(pg15Result);
      const pg16AConst = findAConstInAST(pg16Result);
      
      console.log("PG15 ival:", JSON.stringify(pg15AConst?.ival));
      console.log("PG16 ival:", JSON.stringify(pg16AConst?.ival));
      
      const pg15IsEmpty = pg15AConst?.ival && Object.keys(pg15AConst.ival).length === 0;
      const pg16HasValue = pg16AConst?.ival && typeof pg16AConst.ival.ival === 'number';
      
      console.log("PG15 has empty ival:", pg15IsEmpty);
      console.log("PG16 has ival value:", pg16HasValue);
      console.log("Should transform:", pg15IsEmpty && pg16HasValue);
      
      if (pg16HasValue) {
        console.log("PG16 actual value:", pg16AConst.ival.ival);
        console.log("Matches expected:", pg16AConst.ival.ival === testCase.expectedValue);
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

analyzeSQLValues();
