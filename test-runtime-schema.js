const { PgProtoParser } = require('./packages/parser/src/parser');
const path = require('path');

const protoFile = path.join(__dirname, '__fixtures__/proto/17-latest.proto');

const options = {
  outDir: './test-output',
  runtimeSchema: {
    enabled: true,
    filename: 'runtime-schema',
    format: 'json'
  }
};

try {
  const parser = new PgProtoParser(protoFile, options);
  parser.write();
  console.log('Runtime schema generated successfully!');
} catch (error) {
  console.error('Error generating runtime schema:', error);
}
