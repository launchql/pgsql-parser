import pkg from '../package.json';
import { PgProtoParser, PgProtoParserOptions } from 'pg-proto-parser';

export const help = (): void => {
  console.log(`
  Usage:
  
  pg-proto-parser --inFile <path-to-proto> --outDir <output-directory>
                  [--alternateCommentMode] [--includeEnums] [--includeEnumsJSON]
                  [--includeEnumTypeUnion] [--includeHeader] [--includeTypes]
                  [--includeUtils] [--keepCase] [--optionalFields]
                  [--preferTrailingComment] [--removeUndefinedAt0]
  
  Options:
  
  --help                      Show this help message and exit.
  --inFile                    Path to the .proto file to be parsed.
  --outDir                    Directory to save the generated TypeScript files.
  --alternateCommentMode      Use alternate comment mode for parsing comments.
  --includeEnums              Generate TypeScript enum types for PostgreSQL enums.
  --includeEnumsJSON          Generate JSON files mapping enum names to values.
  --includeEnumTypeUnion      Generate TypeScript unions from enum types.
  --includeHeader             Include a header in the generated TypeScript files.
  --includeTypes              Generate TypeScript interfaces for protobuf messages.
  --includeUtils              Generate TypeScript utility functions for enums.
  --keepCase                  Keep field casing as defined in the protobuf file.
  --optionalFields            Generate TypeScript interfaces with optional fields.
  --preferTrailingComment     Prefer trailing comments during parsing.
  --removeUndefinedAt0        Remove the 'UNDEFINED' enum entry if it exists.
  `);
}

export default async (argv) => {

  if (argv.help || argv.h) {
    help();
    process.exit(0);
  }

  if (argv.version || argv.v) {
    console.log(`Version: ${pkg.version}`);
    process.exit(0);
  }

  if (!argv.inFile || !argv.outDir) {
    console.log('Input Error: inFile and outDir are required!');
    help();
    process.exit(1);
  }

  const options: PgProtoParserOptions = {
    outDir: argv.outDir,
    includeEnumsJSON: argv.includeEnumsJSON ?? true,
    includeTypes: argv.includeTypes ?? true,
    includeUtils: argv.includeUtils ?? true,
    includeEnumTypeUnion: argv.includeEnumTypeUnion ?? true,
    includeEnums: argv.includeEnums ?? true,
    includeHeader: argv.includeHeader ?? true,
    optionalFields: argv.optionalFields ?? true,
    removeUndefinedAt0: argv.removeUndefinedAt0 ?? true,
    parser: {
      keepCase: argv.keepCase ?? true,
      alternateCommentMode: argv.alternateCommentMode ?? true,
      preferTrailingComment: argv.preferTrailingComment ?? false
    }
  };

  const parser = new PgProtoParser(argv.inFile, options);

  // Generate TypeScript and JSON files
  await parser.write();

};