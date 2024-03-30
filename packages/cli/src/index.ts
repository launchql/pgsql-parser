import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';

export default async (argv) => {

  if (!argv.inFile || !argv.outDir) {
    console.log('inFile and outDir are required!');
    console.log('Usage:');
    console.log('pg-proto-parser --inFile=input.proto --outDir=out [--includeEnumsJSON] [--includeTypes] [--includeUtils]');
    process.exit(1);
  }

  const options: PgProtoParserOptions = {
    outDir: argv.outDir,
    includeEnumsJSON: argv.includeEnumsJSON,
    includeTypes: argv.includeTypes,
    includeUtils: argv.includeUtils,
    parser: {
      keepCase: argv.keepCase,
      alternateCommentMode: argv.alternateCommentMode,
      preferTrailingComment: argv.preferTrailingComment
    }
  };

  const parser = new PgProtoParser(argv.inFile, options);

  // Generate TypeScript and JSON files
  await parser.write();

};