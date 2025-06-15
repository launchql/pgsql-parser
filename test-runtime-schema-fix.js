const protobuf = require('@launchql/protobufjs');
const fs = require('fs');
const path = require('path');

console.log('=== Testing RuntimeSchemaGenerator Fix ===');

try {
  const { PgProtoParser } = require('./packages/parser/src/parser');
  
  const protoPath = path.resolve('__fixtures__/proto/16-latest.proto');
  const outDir = path.resolve('test-output');
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const options = {
    outDir,
    runtimeSchema: {
      enabled: true,
      format: 'json',
      filename: 'test-runtime-schema'
    }
  };
  
  console.log('✅ Creating parser with runtime schema enabled');
  
  const parser = new PgProtoParser(protoPath, options);
  parser.write();
  
  console.log('✅ Parser executed successfully');
  
  const schemaPath = path.join(outDir, 'test-runtime-schema.json');
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const nodeSpecs = JSON.parse(schemaContent);
    
    console.log(`✅ NodeSpecs generated: ${nodeSpecs.length}`);
    
    if (nodeSpecs.length > 0) {
      console.log('\n=== Sample NodeSpec ===');
      console.log(JSON.stringify(nodeSpecs[0], null, 2));
      
      const wrappedCount = nodeSpecs.filter(spec => spec.wrapped).length;
      const unwrappedCount = nodeSpecs.filter(spec => !spec.wrapped).length;
      
      console.log(`\n=== Summary ===`);
      console.log(`Total NodeSpecs: ${nodeSpecs.length}`);
      console.log(`Wrapped types: ${wrappedCount}`);
      console.log(`Unwrapped types: ${unwrappedCount}`);
      
      console.log('\n=== First 10 NodeSpec names ===');
      nodeSpecs.slice(0, 10).forEach(spec => {
        console.log(`- ${spec.name} (wrapped: ${spec.wrapped}, fields: ${spec.fields.length})`);
      });
      
      const createStmt = nodeSpecs.find(spec => spec.name === 'CreateStmt');
      if (createStmt) {
        console.log('\n=== CreateStmt Example ===');
        console.log(JSON.stringify(createStmt, null, 2));
      }
    } else {
      console.log('❌ No NodeSpecs generated - fix did not work');
    }
  } else {
    console.log('❌ Runtime schema file not created');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}
