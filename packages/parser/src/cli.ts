#!/usr/bin/env node

import { PgProtoParser } from './parser';
import { program } from 'commander';
import { join } from 'path';

program
  .name('pg-proto-parser')
  .description('PostgreSQL protobuf parser and code generator')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate TypeScript types and runtime schema from protobuf files')
  .argument('<proto-file>', 'Path to the protobuf file')
  .option('-o, --out-dir <dir>', 'Output directory', './out')
  .option('--types', 'Generate TypeScript types')
  .option('--enums', 'Generate TypeScript enums')
  .option('--runtime-schema', 'Generate runtime schema')
  .option('--runtime-schema-format <format>', 'Runtime schema format (json|typescript)', 'json')
  .action((protoFile, options) => {
    const parserOptions = {
      outDir: options.outDir,
      types: {
        enabled: options.types || false,
        filename: 'types.ts'
      },
      enums: {
        enabled: options.enums || false,
        filename: 'enums.ts'
      },
      runtimeSchema: {
        enabled: options.runtimeSchema || false,
        filename: 'runtime-schema',
        format: options.runtimeSchemaFormat
      }
    };

    try {
      const parser = new PgProtoParser(protoFile, parserOptions);
      parser.write();
      console.log(`Generated files in ${options.outDir}`);
    } catch (error) {
      console.error('Error generating files:', error);
      process.exit(1);
    }
  });

program.parse();
