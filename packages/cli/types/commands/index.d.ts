import { CLIOptions, Inquirerer } from 'inquirerer';
import { ParsedArgs } from 'minimist';
export declare const commands: (argv: Partial<ParsedArgs>, prompter: Inquirerer, _options: CLIOptions) => Promise<Partial<ParsedArgs>>;
