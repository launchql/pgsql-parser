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
      type: 'autocomplete',
      name: 'format',
      message: 'Choose output format:',
      options: ['json', 'typescript'],
      default: 'json',
      useDefault: true
    },
    {
      type: 'text',
      name: 'filename',
      message: 'Filename for runtime schema (without extension):',
      default: 'runtime-schema',
      useDefault: true
    }
  ]);
  
  argv = await cli(argv);
  
  return argv;
};
