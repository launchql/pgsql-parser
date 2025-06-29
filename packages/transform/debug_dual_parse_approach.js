const { Parser } = require('@pgsql/parser');

async function exploreDualParseApproach() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  
  const testCases = [
    { sql: "insert into atacc2 (test2) values (-3)", expected: "negative" },
    { sql: "insert into atacc2 (test2) values (0)", expected: "zero" },
    { sql: "insert into atacc2 (test2) values (5)", expected: "positive" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -1)", expected: "negative" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)", expected: "zero" }
  ];
  
  console.log("=== DUAL-PARSE APPROACH EXPLORATION ===");
  console.log("Strategy: Parse same SQL with both PG15 and PG16, compare A_Const ival structures");
  console.log("If PG15 has empty {} but PG16 has nested {ival: X}, then transform is needed\n");
  
  const transformationRules = [];
  
  for (const testCase of testCases) {
    console.log(`=== ${testCase.expected.toUpperCase()}: ${testCase.sql} ===`);
    
    try {
      const pg15Result = await parser15.parse(testCase.sql);
      const pg16Result = await parser16.parse(testCase.sql);
      
      const pg15AConst = findAConstInAST(pg15Result);
      const pg16AConst = findAConstInAST(pg16Result);
      
      if (pg15AConst && pg16AConst) {
        const pg15IsEmpty = pg15AConst.ival && Object.keys(pg15AConst.ival).length === 0;
        const pg16HasNested = pg16AConst.ival && typeof pg16AConst.ival.ival === 'number';
        const shouldTransform = pg15IsEmpty && pg16HasNested;
        
        console.log("PG15 ival:", JSON.stringify(pg15AConst.ival));
        console.log("PG16 ival:", JSON.stringify(pg16AConst.ival));
        console.log("PG15 is empty:", pg15IsEmpty);
        console.log("PG16 has nested:", pg16HasNested);
        console.log("Should transform:", shouldTransform);
        
        if (shouldTransform) {
          const targetValue = pg16AConst.ival.ival;
          console.log(`RULE: Transform empty {} to {ival: ${targetValue}}`);
          transformationRules.push({
            sql: testCase.sql,
            targetValue: targetValue,
            type: testCase.expected
          });
        } else {
          console.log("RULE: Keep empty {} as is");
        }
        
        console.log("");
      }
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  console.log("=== TRANSFORMATION RULES DISCOVERED ===");
  transformationRules.forEach((rule, i) => {
    console.log(`${i + 1}. ${rule.type} integers: Transform {} to {ival: ${rule.targetValue}}`);
  });
  
  console.log("\n=== DUAL-PARSE IMPLEMENTATION STRATEGY ===");
  console.log("1. In A_Const method, when encountering empty ival object:");
  console.log("2. Extract the original SQL from the current transformation context");
  console.log("3. Parse the SQL with both PG15 and PG16");
  console.log("4. Compare the A_Const ival structures");
  console.log("5. If PG16 expects nested structure, transform; otherwise keep empty");
  console.log("6. Cache results to avoid re-parsing the same SQL multiple times");
  
  console.log("\n=== FEASIBILITY ASSESSMENT ===");
  console.log("✅ Technically feasible - can access both parsers in transformer");
  console.log("✅ Accurate - directly compares what PG16 expects vs PG15 produces");
  console.log("⚠️  Performance - may be slower due to dual parsing");
  console.log("⚠️  Complexity - need to extract original SQL from transformation context");
  console.log("✅ Reliable - eliminates guesswork about when to transform");
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

exploreDualParseApproach();
