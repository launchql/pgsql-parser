const { Parser } = require('@pgsql/parser');

async function exploreAlternativeApproaches() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  
  const testCases = [
    { sql: "insert into atacc2 (test2) values (-3)", type: "negative" },
    { sql: "insert into atacc2 (test2) values (0)", type: "zero" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -1)", type: "negative" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)", type: "zero" }
  ];
  
  console.log("=== EXPLORING ALTERNATIVE APPROACHES ===");
  
  for (const testCase of testCases) {
    console.log(`\n=== ${testCase.type.toUpperCase()}: ${testCase.sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(testCase.sql);
      const pg16Result = await parser16.parse(testCase.sql);
      
      const pg15AConst = findAConstWithContext(pg15Result);
      const pg16AConst = findAConstWithContext(pg16Result);
      
      if (pg15AConst && pg16AConst) {
        console.log("PG15 A_Const context:", JSON.stringify({
          ival: pg15AConst.node.ival,
          location: pg15AConst.node.location,
          parentPath: pg15AConst.path
        }, null, 2));
        
        console.log("PG16 A_Const context:", JSON.stringify({
          ival: pg16AConst.node.ival,
          location: pg16AConst.node.location,
          parentPath: pg16AConst.path
        }, null, 2));
        
        const shouldTransform = JSON.stringify(pg15AConst.node.ival) !== JSON.stringify(pg16AConst.node.ival);
        console.log("Should transform:", shouldTransform);
        
        if (shouldTransform) {
          console.log("PATTERN: Empty ival in PG15 should become nested in PG16");
        } else {
          console.log("PATTERN: Empty ival should remain empty");
        }
      }
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  console.log("\n=== POTENTIAL SOLUTIONS ===");
  console.log("1. Parse-time detection: Check if original SQL contains negative number");
  console.log("2. Location-based heuristics: Use location differences to detect patterns");
  console.log("3. Dual-parse approach: Parse with both PG15 and PG16 to compare expected results");
  console.log("4. SQL regex analysis: Extract numeric values from original SQL before parsing");
}

function findAConstWithContext(obj, path = []) {
  if (!obj || typeof obj !== 'object') return null;
  
  if (obj.A_Const) {
    return { node: obj.A_Const, path: [...path, 'A_Const'] };
  }
  
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findAConstWithContext(obj[key], [...path, key]);
      if (result) return result;
    }
  }
  
  return null;
}

exploreAlternativeApproaches();
