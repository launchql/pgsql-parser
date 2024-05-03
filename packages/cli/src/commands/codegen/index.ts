import { CLIOptions, Inquirerer } from 'inquirerer'
import { ParsedArgs } from 'minimist';
import cli, { help } from './cli';
export const commands = async (argv: Partial<ParsedArgs>, prompter: Inquirerer, _options: CLIOptions) => {
  
  if (argv.help || argv.h) {
    help();
    process.exit(0);
  }

  argv = await prompter.prompt(argv, [
    {
      type: 'text',
      name: 'inFile',
      message: 'provide inFile (./path/to/proto.proto):'
    },
    {
      type: 'text',
      name: 'outDir',
      message: 'provide outDir (./outputDir):'
    },
    {
      type: 'confirm',
      name: 'enums',
      message: 'Enable enums?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'typeUnion',
      message: 'Use enums as type union?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'enumsJSON',
      message: 'Enable JSON for enums?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'removeUndefined',
      message: 'Remove undefined at index 0?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'header',
      message: 'Include header in output?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'case',
      message: 'Keep case in parser?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'types',
      message: 'Enable types?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'optional',
      message: 'Are optional fields enabled?',
      default: false,
      useDefault: true
    },
    {
      type: 'confirm',
      name: 'utils',
      message: 'Enable AST helpers in utils?',
      default: false,
      useDefault: true
    }
  ]);
  
  argv = await cli(argv);
  
  return argv;
};