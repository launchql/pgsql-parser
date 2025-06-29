const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

async function debugEmptyIvalDetection() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  
  console.log("=== EMPTY IVAL DETECTION STRATEGY ===");
  console.log("Goal: Detect when empty {} should become {ival: X} vs remain empty\n");
  
  const testCases = [
    { sql: "insert into atacc2 (test2) values (-3)", expected: "transform", desc: "negative integer" },
    { sql: "insert into atacc2 (test2) values (0)", expected: "keep empty", desc: "zero value" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= -1)", expected: "transform", desc: "negative in constraint" },
    { sql: "ALTER TABLE onek ADD CONSTRAINT onek_check_constraint CHECK (unique1 >= 0)", expected: "keep empty", desc: "zero in constraint" }
  ];
  
  const transformationRules = [];
  
  for (const testCase of testCases) {
    console.log(`=== ${testCase.desc.toUpperCase()}: ${testCase.sql} ===`);
    
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
        console.log("Should transform:", pg15IsEmpty && pg16HasNested);
        
        if (pg15IsEmpty && pg16HasNested) {
          const targetValue = pg16AConst.ival.ival;
          transformationRules.push({
            sql: testCase.sql,
            targetValue: targetValue,
            pattern: `Transform {} to {ival: ${targetValue}}`
          });
          console.log(`✅ RULE: ${transformationRules[transformationRules.length - 1].pattern}`);
        } else if (pg15IsEmpty && !pg16HasNested) {
          console.log("✅ RULE: Keep {} as empty");
        }
        
        console.log("");
      }
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  
  console.log("=== IMPLEMENTATION STRATEGY ===");
  console.log("Since we can't easily implement async dual-parse in transformer:");
  console.log("1. Create a synchronous helper that uses SQL pattern matching");
  console.log("2. Extract numeric patterns from context or SQL fragments");
  console.log("3. Use heuristics based on common negative integer patterns");
  console.log("4. Implement conservative transformation that only handles clear cases");
  
  console.log("\n=== DISCOVERED TRANSFORMATION RULES ===");
  transformationRules.forEach((rule, i) => {
    console.log(`${i + 1}. ${rule.pattern} (from: ${rule.sql.substring(0, 50)}...)`);
  });
  
  console.log("\n=== NEXT STEPS ===");
  console.log("Implement targeted A_Const fix that:");
  console.log("- Detects empty ival objects");
  console.log("- Uses context clues to determine if transformation needed");
  console.log("- Only transforms when confident it's a negative integer case");
  console.log("- Preserves zero values as empty objects");
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

debugEmptyIvalDetection();
