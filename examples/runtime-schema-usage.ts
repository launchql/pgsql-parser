import { RuntimeSchemaGenerator } from '../packages/parser/src/runtime-schema/generator';
import { NodeSpec, FieldSpec } from '../packages/parser/src/runtime-schema/types';

function analyzeASTStructure(nodeSpecs: NodeSpec[]) {
  console.log('=== PostgreSQL AST Structure Analysis ===\n');
  
  const wrappedTypes = nodeSpecs.filter(spec => spec.wrapped);
  const unwrappedTypes = nodeSpecs.filter(spec => !spec.wrapped);
  
  console.log(`Total AST node types: ${nodeSpecs.length}`);
  console.log(`Wrapped types (in Node.oneof): ${wrappedTypes.length}`);
  console.log(`Unwrapped types: ${unwrappedTypes.length}\n`);
  
  const statementTypes = wrappedTypes.filter(spec => spec.name.endsWith('Stmt'));
  const expressionTypes = wrappedTypes.filter(spec => spec.name.endsWith('Expr'));
  const literalTypes = wrappedTypes.filter(spec => 
    ['Integer', 'String', 'Boolean', 'Float', 'BitString'].includes(spec.name)
  );
  
  console.log('=== Type Categories ===');
  console.log(`Statement types (*Stmt): ${statementTypes.length}`);
  console.log(`Expression types (*Expr): ${expressionTypes.length}`);
  console.log(`Literal types: ${literalTypes.length}\n`);
  
  console.log('=== Special Types Analysis ===');
  const typeNameSpec = nodeSpecs.find(spec => spec.name === 'TypeName');
  const rangeVarSpec = nodeSpecs.find(spec => spec.name === 'RangeVar');
  
  if (typeNameSpec) {
    console.log(`TypeName: wrapped=${typeNameSpec.wrapped}, fields=${typeNameSpec.fields.length}`);
    console.log(`  - Node fields: ${typeNameSpec.fields.filter(f => f.isNode).length}`);
    console.log(`  - Array fields: ${typeNameSpec.fields.filter(f => f.isArray).length}`);
  }
  
  if (rangeVarSpec) {
    console.log(`RangeVar: wrapped=${rangeVarSpec.wrapped}, fields=${rangeVarSpec.fields.length}`);
    console.log(`  - Node fields: ${rangeVarSpec.fields.filter(f => f.isNode).length}`);
    console.log(`  - Array fields: ${rangeVarSpec.fields.filter(f => f.isArray).length}`);
  }
  
  console.log('\n=== Field Type Distribution ===');
  const allFields = nodeSpecs.flatMap(spec => spec.fields);
  const nodeFields = allFields.filter(field => field.isNode);
  const arrayFields = allFields.filter(field => field.isArray);
  const optionalFields = allFields.filter(field => field.optional);
  
  console.log(`Total fields across all types: ${allFields.length}`);
  console.log(`Node/wrapped type fields: ${nodeFields.length} (${(nodeFields.length/allFields.length*100).toFixed(1)}%)`);
  console.log(`Array fields: ${arrayFields.length} (${(arrayFields.length/allFields.length*100).toFixed(1)}%)`);
  console.log(`Optional fields: ${optionalFields.length} (${(optionalFields.length/allFields.length*100).toFixed(1)}%)`);
  
  const fieldTypes = new Map<string, number>();
  allFields.forEach(field => {
    fieldTypes.set(field.type, (fieldTypes.get(field.type) || 0) + 1);
  });
  
  console.log('\n=== Most Common Field Types ===');
  const sortedTypes = Array.from(fieldTypes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  sortedTypes.forEach(([type, count]) => {
    console.log(`  ${type}: ${count} fields`);
  });
}

function findComplexTypes(nodeSpecs: NodeSpec[]): NodeSpec[] {
  return nodeSpecs
    .filter(spec => spec.fields.length > 10)
    .sort((a, b) => b.fields.length - a.fields.length);
}

function findTypesWithMostNodeReferences(nodeSpecs: NodeSpec[]): NodeSpec[] {
  return nodeSpecs
    .map(spec => ({
      ...spec,
      nodeFieldCount: spec.fields.filter(f => f.isNode).length
    }))
    .filter(spec => spec.nodeFieldCount > 0)
    .sort((a, b) => b.nodeFieldCount - a.nodeFieldCount)
    .slice(0, 10);
}

export { analyzeASTStructure, findComplexTypes, findTypesWithMostNodeReferences };
