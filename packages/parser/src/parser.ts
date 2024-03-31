import { parse } from '@launchql/protobufjs';
import { readFileSync } from 'fs';
import { ProtoStore } from './store';
import {
  defaultPgProtoParserOptions,
  PgProtoParserOptions
} from './options';

export class PgProtoParser {
  inFile: string;
  options: PgProtoParserOptions;

  constructor(inFile: string, options?: PgProtoParserOptions) {
    this.inFile = inFile;

    // Merge the provided options with the default options
    this.options = { ...defaultPgProtoParserOptions, ...options };

    // If the 'parser' sub-object is explicitly provided, merge it separately to ensure deep merging
    if (options?.parser) {
      this.options.parser = { ...defaultPgProtoParserOptions.parser, ...options.parser };
    }

  }

  private readProtoFile(): string {
    return readFileSync(this.inFile, 'utf-8');
  }

  private parseProto(content: string): any {
    return parse(content, this.options.parser);
  }

  public write(): void {
    const protoContent = this.readProtoFile();
    const ast = this.parseProto(protoContent);
    const store = new ProtoStore(ast.root, this.options);
    store.write();
  }
}
