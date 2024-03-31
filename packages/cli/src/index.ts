import pkg from '../package.json';
import { PgProtoParser, PgProtoParserOptions, getOptionsWithDefaults } from 'pg-proto-parser';
import o from 'nested-obj';

export const help = (): void => {
  console.log(`
  Usage:
  
  pg-proto-parser --input <path-to-proto> --output <output-directory>
                  [--enums] [--enumsJSON] [--typeUnion] 
                  [--header] [--types] [--utils] 
                  [--case] [--optional] [--removeUndefined]
  
  Options:
  
  --help, -h                 Show this help message and exit.
  --input, -i                Path to the .proto file to be parsed.
  --output, -o               Directory to save the generated TypeScript files.
  --enums                    Generate TypeScript enum types for PostgreSQL enums.
  --enumsJSON                Generate JSON files mapping enum names to values.
  --typeUnion                Generate TypeScript unions from enum types.
  --header                   Include a header in the generated TypeScript files.
  --types                    Generate TypeScript interfaces for protobuf messages.
  --utils                    Generate TypeScript utility functions for enums.
  --case                     Keep field casing as defined in the protobuf file.
  --optional                 Generate TypeScript interfaces with optional fields.
  --removeUndefined          Remove the 'UNDEFINED' enum entry if it exists.
  --version, -v              Show the version number and exit.
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

  if (!argv.input || !argv.output) {
    console.log('Input Error: input and output are required!');
    help();
    process.exit(1);
  }

  const options: PgProtoParserOptions = getOptionsWithDefaults({
    outDir: argv.output
  });

  // Setting nested options using objectPath
  o.set(options, 'enums.enabled', argv.enums);
  o.set(options, 'enums.enumsAsTypeUnion', argv.typeUnion);
  o.set(options, 'enums.json.enabled', argv.enumsJSON);
  o.set(options, 'enums.removeUndefinedAt0', argv.removeUndefined);
  o.set(options, 'includeHeader', argv.header);
  o.set(options, 'parser.keepCase', argv.case);
  o.set(options, 'types.enabled', argv.types);
  o.set(options, 'types.optionalFields', argv.optional);
  o.set(options, 'utils.astHelpers.enabled', argv.utils);

  const parser = new PgProtoParser(argv.input, options);

  // Generate TypeScript and JSON files
  await parser.write();
};
