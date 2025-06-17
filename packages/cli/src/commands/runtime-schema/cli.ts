import { readAndParsePackageJson } from '../../package';
import { PgProtoParser, PgProtoParserOptions, getOptionsWithDefaults } from 'pg-proto-parser';
import o from 'nested-obj';

export const help = (): void => {
  console.log(`
  Usage:
  
  pg-proto-parser runtime-schema --inFile <path-to-proto> --outDir <output-directory>
                                 [--format <json|typescript>] [--filename <filename>]
  
  Options:
  
  --help, -h                 Show this help message and exit.
  --inFile                   Path to the .proto file to be parsed.
  --outDir                   Directory to save the generated runtime schema files.
  --format                   Output format for runtime schema ('json' or 'typescript').
  --filename                 Filename for the runtime schema file (without extension).
  --version, -v              Show the version number and exit.
  `);
}

export default async (argv: any) => {

  if (argv.help || argv.h) {
    help();
    process.exit(0);
  }

  if (argv.version || argv.v) {
    console.log(`Version: ${readAndParsePackageJson().version}`);
    process.exit(0);
  }

  if (!argv.inFile || !argv.outDir) {
    console.log('Input Error: inFile and outDir are required!');
    help();
    process.exit(1);
  }

  const options: PgProtoParserOptions = getOptionsWithDefaults({
    outDir: argv.outDir
  });

  o.set(options, 'runtimeSchema.enabled', true);
  o.set(options, 'runtimeSchema.format', argv.format || 'json');
  o.set(options, 'runtimeSchema.filename', argv.filename || 'runtime-schema');
  
  o.set(options, 'types.enabled', false);
  o.set(options, 'enums.enabled', false);
  o.set(options, 'utils.astHelpers.enabled', false);
  o.set(options, 'utils.enums.enabled', false);

  console.log(`Generating runtime schema from ${argv.inFile}...`);
  const parser = new PgProtoParser(argv.inFile, options);
  await parser.write();
  
  const extension = argv.format === 'typescript' ? 'ts' : 'json';
  console.log(`Runtime schema generated successfully in ${argv.outDir}/${argv.filename || 'runtime-schema'}.${extension}`);

  return argv;
};
