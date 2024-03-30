import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';

export default async (argv) => {

  if (!argv.inFile || !argv.outDir) {
    console.log('inFile and outDir are required!');
    console.log('Usage:');
    console.log('pg-proto-parser --inFile input.proto --outDir out [--includeEnumsJSON] [--includeTypes] [--includeUtils]');
    process.exit(1);
  }

  const options: PgProtoParserOptions = {
    outDir: argv.outDir,
    includeEnumsJSON: argv.hasOwnProperty('includeEnumsJSON') ? argv.includeEnumsJSON : true,
    includeTypes: argv.hasOwnProperty('includeTypes') ? argv.includeTypes : true,
    includeUtils: argv.hasOwnProperty('includeUtils') ? argv.includeUtils : true,
    includeEnumTypeUnion: argv.hasOwnProperty('includeEnumTypeUnion') ? argv.includeEnumTypeUnion : true,
    includeEnums: argv.hasOwnProperty('includeEnums') ? argv.includeEnums : true,
    includeHeader: argv.hasOwnProperty('includeHeader') ? argv.includeHeader : true,
    optionalFields: argv.hasOwnProperty('optionalFields') ? argv.optionalFields : true,
    removeUndefinedAt0: argv.hasOwnProperty('removeUndefinedAt0') ? argv.removeUndefinedAt0 : true,
    parser: {
      keepCase: argv.hasOwnProperty('keepCase') ? argv.keepCase : true,
      alternateCommentMode: argv.hasOwnProperty('alternateCommentMode') ? argv.alternateCommentMode : true,
      preferTrailingComment: argv.hasOwnProperty('preferTrailingComment') ? argv.preferTrailingComment : false
    }
  };

  const parser = new PgProtoParser(argv.inFile, options);

  // Generate TypeScript and JSON files
  await parser.write();

};