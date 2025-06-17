import { CLIOptions, Inquirerer } from 'inquirerer';
import { ParsedArgs } from 'minimist';
import cli, { CommandOptions, help } from './cli';
export const commands = async (argv: Partial<ParsedArgs>, prompter: Inquirerer, _options: CLIOptions) => {
  
  if (argv.help || argv.h) {
    help();
    process.exit(0);
  }

  argv = await prompter.prompt(argv, [
    // use false, TODO: add optional flag on questions allowSkip: boolean
    // @ts-ignore
    {
      type: 'text',
      name: 'protoUrl',
      message: 'Enter the URL to the proto file (optional):',
      required: false,
      default: false,
      useDefault: true
    },
    {
      type: 'text',
      name: 'inFile',
      message: 'Provide the path where the proto file will be saved or the path to an existing proto file:',
      required: true
    },
    {
      type: 'text',
      name: 'outFile',
      message: 'Provide the path where the generated JavaScript file will be saved:',
      required: true
    },
    {
      type: 'text',
      name: 'originalPackageName',
      message: 'Enter the original package name to be replaced in the JS file:',
      required: true,
      default: 'protobufjs/minimal',
      useDefault: true
    },
    {
      type: 'text',
      name: 'newPackageName',
      message: 'Enter the new package name to replace in the JS file:',
      required: true,
      default: '@launchql/protobufjs/minimal',
      useDefault: true
    }
  ]);

  argv = await cli(argv as CommandOptions);

  return argv;
};
