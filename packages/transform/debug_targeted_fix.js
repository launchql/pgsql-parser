const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

function debugTargetedFix() {
  console.log("=== TARGETED A_CONST FIX APPROACH ===");
  console.log("Strategy: Only transform empty ival objects in specific contexts where confident it's negative\n");
  
  const transformer = new V15ToV16Transformer();
  
  const testNode = {
    A_Const: {
      ival: {},  // Empty object that PG15 produces for negative integers
      location: 63
    }
  };
  
  console.log("=== TEST CASE: Empty ival object ===");
  console.log("Input node:", JSON.stringify(testNode, null, 2));
  
  const context = { parentNodeTypes: ['TypeName', 'ColumnDef', 'CreateStmt'] };
  const result = transformer.transform(testNode, context);
  
  console.log("Transformed result:", JSON.stringify(result, null, 2));
  console.log("Expected PG16 result: { A_Const: { ival: { ival: -3 }, location: 63 } }");
  
  console.log("\n=== ANALYSIS ===");
  const hasEmptyIval = result.A_Const && result.A_Const.ival && 
                      typeof result.A_Const.ival === 'object' && 
                      Object.keys(result.A_Const.ival).length === 0;
  
  console.log("Result has empty ival:", hasEmptyIval);
  console.log("Transformation needed:", hasEmptyIval ? "YES" : "NO");
  
  if (hasEmptyIval) {
    console.log("\n=== PROPOSED FIX ===");
    console.log("Detect empty ival objects in A_Const and transform to nested structure");
    console.log("Use context clues or heuristics to determine appropriate negative value");
    console.log("Conservative approach: only transform when confident it's a negative integer case");
  }
}

debugTargetedFix();
