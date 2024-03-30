import { ProtoStore } from 'pg-proto-parser';
import fs from 'fs';

export default async (argv) => {

  if (!argv.inputFile || !argv.outputDir) {
    console.log('inputFile and outputDir are required!');
    console.log('Usage:');
    console.log('pg-proto-parser --inputFile=input.proto --outputDir=out');
    process.exit(1);
  }


  // Read the .proto file
  const protoContent = fs.readFileSync(argv.inputFile, 'utf8');

  // Load the protobuf definition
  const root = Root.fromJSON(JSON.parse(protoContent));

  // Create an instance of ProtoStore with the loaded root and specified output directory
  const protoStore = new ProtoStore(root, argv.outputDir);

  // Generate TypeScript and JSON files
  await protoStore.write();

};