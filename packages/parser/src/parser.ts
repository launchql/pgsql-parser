import { parse } from '@launchql/protobufjs';
import { readFileSync } from 'fs';
import { ProtoStore } from './store';

export interface ParseProtoOptions {
  keepCase?: boolean;
  alternateCommentMode?: boolean;
  preferTrailingComment?: boolean;
}

const protoParseOptionsDefaults: ParseProtoOptions = {
  keepCase: true,
  alternateCommentMode: true,
  preferTrailingComment: false
};

export class PgProtoParser {
  private inputFile: string;
  private outputDir: string;
  private parseOptions: ParseProtoOptions;

  constructor(inputFile: string, outputDir: string, parseOptions?: ParseProtoOptions) {
    this.inputFile = inputFile;
    this.outputDir = outputDir;
    this.parseOptions = { ...protoParseOptionsDefaults, ...parseOptions };
  }

  private readProtoFile(): string {
    return readFileSync(this.inputFile, 'utf-8');
  }

  private parseProto(content: string): any {
    return parse(content, this.parseOptions);
  }

  public write(): void {
    const protoContent = this.readProtoFile();
    const ast = this.parseProto(protoContent);
    const store = new ProtoStore(ast.root, this.outputDir);
    store.write();
  }
}
