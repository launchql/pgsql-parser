import * as fs from 'fs';
import * as path from 'path';

// Read the versions configuration
const configPath = path.join(__dirname, '../config/parser-versions.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Read the package.json template
const templatePath = path.join(__dirname, '../config/package.template.json');
const packageTemplate = fs.readFileSync(templatePath, 'utf-8');

// Create versions directory if it doesn't exist
const versionsDir = path.join(__dirname, '../versions');
if (!fs.existsSync(versionsDir)) {
  fs.mkdirSync(versionsDir, { recursive: true });
}

// Generate version-specific packages
const pgVersions = Object.keys(config['libpg-query']);

pgVersions.forEach(pgVersion => {
  const libpgQueryVersion = config['libpg-query'][pgVersion];

  const typesVersion = config['@pgsql/types'][pgVersion];

  // For pgsql-parser, we only have versions 13 and 17
  let pgsqlParserVersion = config['pgsql-parser'][pgVersion];
  if (!pgsqlParserVersion) {
    // If specific version doesn't exist, skip this PG version
    console.log(`Skipping PG${pgVersion} - no pgsql-parser version available`);
    return;
  }

  // Create version directory
  const versionDir = path.join(versionsDir, `${pgVersion}`);
  if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });
  }

  // Create src directory
  const srcDir = path.join(versionDir, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  // Generate package.json
  const packageJson = packageTemplate
    .replace(/{{VERSION}}/g, `${pgVersion}.0.0`)
    .replace(/{{LIBPG_QUERY_VERSION}}/g, libpgQueryVersion)
    .replace(/{{PGSQL_PARSER_VERSION}}/g, pgsqlParserVersion)
    .replace(/{{TYPES_VERSION}}/g, typesVersion);

  fs.writeFileSync(
    path.join(versionDir, 'package.json'),
    packageJson
  );

  // Generate index.ts
  const indexContent = `export {
  parse as parse,
  parseSync as parseSync,
  loadModule as loadModule
} from 'libpg-query';

export {
  deparse,
  deparseSync,
} from 'pgsql-deparser';

export * from '@pgsql/types';
`;

  fs.writeFileSync(
    path.join(srcDir, 'index.ts'),
    indexContent
  );

  fs.writeFileSync(path.join(versionDir, 'tsconfig.json'), JSON.stringify({
    "compilerOptions": {
      "outDir": "dist",
      "rootDir": "src/",
      "target": "es2022",
      "module": "commonjs",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "strictNullChecks": false,
      "skipLibCheck": true,
      "sourceMap": false,
      "declaration": true,
      "resolveJsonModule": true,
      "moduleResolution": "node"
    },
    "include": [
      "src/**/*.ts"
    ],
    "exclude": [
      "dist",
      "node_modules",
      "**/*.spec.*",
      "**/*.test.*"
    ]
  }, null, 2));


  fs.writeFileSync(path.join(versionDir, 'tsconfig.esm.json'), JSON.stringify({
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "dist/esm",
      "module": "es2022",
      "rootDir": "src/",
      "declaration": false
    }
  }, null, 2));


  // Copy the README.md files
  fs.copyFileSync(
    path.join(__dirname, '../README.md'),
    path.join(versionDir, 'README.md')
  );

  console.log(`✓ Generated PG${pgVersion} with libpg-query@${libpgQueryVersion} and pgsql-parser@${pgsqlParserVersion}`);
});

console.log('\nVersion preparation complete!');