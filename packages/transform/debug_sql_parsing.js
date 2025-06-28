const { Parser } = require('@pgsql/parser');

async function debugSQLParsing() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  
  const testCases = [
    "insert into atacc2 (test2) values (-3)",
    "insert into atacc2 (test2) values (3)",
    "insert into atacc2 (test2) values (0)",
    "ALTER TABLE tmp ADD COLUMN j abstime[]"
  ];
  
  console.log("=== DEBUGGING SQL PARSING PATTERNS ===");
  
  for (const sql of testCases) {
    console.log(`\n=== SQL: ${sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(sql);
      const pg16Result = await parser16.parse(sql);
      
      const pg15Integers = findAllIntegers(pg15Result);
      const pg16Integers = findAllIntegers(pg16Result);
      
      console.log("PG15 Integer nodes:", JSON.stringify(pg15Integers, null, 2));
      console.log("PG16 Integer nodes:", JSON.stringify(pg16Integers, null, 2));
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

function findAllIntegers(obj, path = []) {
  const results = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return results;
  }
  
  if (obj.Integer !== undefined) {
    results.push({
      path: path.concat(['Integer']),
      node: obj.Integer
    });
  }
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      results.push(...findAllIntegers(value, path.concat([key])));
    }
  }
  
  return results;
}

debugSQLParsing();
