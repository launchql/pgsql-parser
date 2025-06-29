const { Parser } = require('@pgsql/parser');
const { V15ToV16Transformer } = require('./dist/transformers/v15-to-v16');

class FlowAnalysisTransformer extends V15ToV16Transformer {
  transform(node, context) {
    if (node && typeof node === 'object') {
      const nodeType = this.getNodeType(node);
      if (nodeType === 'Integer' || nodeType === 'A_Const') {
        console.log(`=== TRANSFORM FLOW: ${nodeType} ===`);
        console.log('Input node:', JSON.stringify(node, null, 2));
        console.log('Context path:', context.path);
        console.log('Parent types:', context.parentNodeTypes);
        console.log('Is empty object?', Object.keys(node).length === 0);
        
        const result = super.transform(node, context);
        console.log('Transform result:', JSON.stringify(result, null, 2));
        console.log('===============================');
        return result;
      }
    }
    return super.transform(node, context);
  }
  
  A_Const(node, context) {
    console.log('=== A_CONST METHOD ===');
    console.log('Input node:', JSON.stringify(node, null, 2));
    console.log('Context path:', context.path);
    console.log('Parent types:', context.parentNodeTypes);
    
    const result = super.A_Const(node, context);
    console.log('A_Const result:', JSON.stringify(result, null, 2));
    console.log('===================');
    
    return result;
  }
  
  Integer(node, context) {
    console.log('=== INTEGER METHOD ===');
    console.log('Input node:', JSON.stringify(node, null, 2));
    console.log('Context path:', context.path);
    console.log('Parent types:', context.parentNodeTypes);
    console.log('Is empty?', Object.keys(node).length === 0);
    
    const result = super.Integer(node, context);
    console.log('Integer result:', JSON.stringify(result, null, 2));
    console.log('===================');
    
    return result;
  }
}

async function analyzeTransformationFlow() {
  const parser15 = new Parser(15);
  const parser16 = new Parser(16);
  const transformer = new FlowAnalysisTransformer();
  
  const sql = "insert into atacc2 (test2) values (-3)";
  
  console.log("=== DETAILED TRANSFORMATION FLOW ANALYSIS ===");
  console.log("SQL:", sql);
  
  try {
    const pg15Result = await parser15.parse(sql);
    const pg16Result = await parser16.parse(sql);
    
    console.log("\n=== PG15 A_Const ival ===");
    const pg15AConst = findAConstInInsert(pg15Result);
    console.log(JSON.stringify(pg15AConst?.ival, null, 2));
    
    console.log("\n=== PG16 A_Const ival ===");
    const pg16AConst = findAConstInInsert(pg16Result);
    console.log(JSON.stringify(pg16AConst?.ival, null, 2));
    
    console.log("\n=== STARTING TRANSFORMATION ===");
    const astToTransform = JSON.parse(JSON.stringify(pg15Result));
    if (astToTransform.stmts && Array.isArray(astToTransform.stmts)) {
      astToTransform.stmts = astToTransform.stmts.map((stmtWrapper) => {
        if (stmtWrapper.stmt) {
          const transformedStmt = transformer.transform(stmtWrapper.stmt, { parentNodeTypes: [] });
          return { ...stmtWrapper, stmt: transformedStmt };
        }
        return stmtWrapper;
      });
    }
    
    console.log("\n=== FINAL COMPARISON ===");
    const transformedAConst = findAConstInInsert(astToTransform);
    console.log("PG15 produces:", JSON.stringify(pg15AConst?.ival));
    console.log("PG16 expects:", JSON.stringify(pg16AConst?.ival));
    console.log("My transform produces:", JSON.stringify(transformedAConst?.ival));
    console.log("Match PG16?", JSON.stringify(transformedAConst?.ival) === JSON.stringify(pg16AConst?.ival));
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function findAConstInInsert(obj) {
  if (!obj || typeof obj !== 'object') return null;
  
  try {
    return obj.stmts[0].stmt.InsertStmt.selectStmt.SelectStmt.valuesLists[0].List.items[0].A_Const;
  } catch (e) {
    return null;
  }
}

analyzeTransformationFlow();
