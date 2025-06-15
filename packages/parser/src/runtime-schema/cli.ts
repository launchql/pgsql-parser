#!/usr/bin/env node

import { PgProtoParser } from '../parser';
import { join } from 'path';

const args = process.argv.slice(2);

if (args.length < 1) {
  console.error('Usage: runtime-schema-cli <proto-file> [output-dir]');
  process.exit(1);
}

const protoFile = args[0];
const outputDir = args[1] || './runtime-schema-output';

const options = {
  outDir: outputDir,
  runtimeSchema: {
    enabled: true,
    filename: 'runtime-schema',
    format: 'json' as const
  },
  types: {
    enabled: false
  },
  enums: {
    enabled: false
  },
  utils: {
    enums: {
      enabled: false
    },
    astHelpers: {
      enabled: false
    }
  }
};

try {
  console.log(`Generating runtime schema from ${protoFile}...`);
  const parser = new PgProtoParser(protoFile, options);
  parser.write();
  console.log(`Runtime schema generated successfully in ${outputDir}/runtime-schema.json`);
} catch (error) {
  console.error('Error generating runtime schema:', error);
  process.exit(1);
}
