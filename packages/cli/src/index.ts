import { PgProtoParser } from 'pg-proto-parser';

export default async (argv) => {

  if (!argv.inputFile || !argv.outputDir) {
    console.log('inputFile and outputDir are required!');
    console.log('Usage:');
    console.log('pg-proto-parser --inputFile input.proto --outputDir out');
    process.exit(1);
  }

  const parser = new PgProtoParser(argv.inputFile, argv.outputDir);

  // Generate TypeScript and JSON files
  await parser.write();

};