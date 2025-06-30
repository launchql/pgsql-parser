import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to generate package.json files for each version directory
 * Uses version-config.json to map versions to their dependencies
 */

const VERSIONS_DIR = 'versions';
const CONFIG_FILE = 'config/deparser-versions.json';

interface VersionConfig {
  deparserVersion: string;
  typesVersion: string;
  pgVersion: string;
  npmTag: string;
}

interface Config {
  packageName: string;
  versions: Record<string, VersionConfig>;
  packageTemplate: Record<string, any>;
}

function loadConfig(): Config {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  const configContent = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configContent);
}

function generatePackageJson(packageName: string, version: string, versionConfig: VersionConfig, template: Record<string, any>): any {
  return {
    name: packageName,
    version: versionConfig.deparserVersion,
    description: `PostgreSQL v${version} AST Deparser - Transforms v${version} ASTs to v17 and deparses them`,
    main: "index.js",
    module: "esm/index.js",
    types: "index.d.ts",
    ...template,
    scripts: {
      "copy": "copyfiles -f ../../LICENSE README.md package.json dist",
      "clean": "rimraf dist",
      "prepare": "npm run build",
      "build": "npm run clean && tsc && tsc -p tsconfig.esm.json && npm run copy"
    },
    dependencies: {
      [`@pgsql/types`]: `^${versionConfig.typesVersion}`
    },
    keywords: [
      ...template.keywords,
      `v${version}`,
      `postgresql-${version}`
    ]
  };
}

function generateTsConfig(): any {
  return {
    "compilerOptions": {
      "target": "es2018",
      "module": "commonjs",
      "lib": ["es2018"],
      "declaration": true,
      "outDir": "./dist",
      "rootDir": "./",
      "strict": false,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "moduleResolution": "node",
      "resolveJsonModule": true
    },
    "include": [
      "**/*.ts"
    ],
    "exclude": [
      "node_modules",
      "dist",
      "**/*.test.ts"
    ]
  };
}

function generateTsConfigEsm(): any {
  return {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "module": "esnext",
      "outDir": "./dist/esm",
      "declaration": false
    }
  };
}

function generateVersionPackages(): void {
  console.log('Generating package.json files for each version...\n');
  
  const config = loadConfig();
  
  for (const [version, versionConfig] of Object.entries(config.versions)) {
    console.log(`Processing version ${version}...`);
    
    const versionDir = path.join(VERSIONS_DIR, version);
    
    if (!fs.existsSync(versionDir)) {
      console.error(`  ✗ Version directory ${versionDir} does not exist!`);
      continue;
    }
    
    // Generate package.json
    const packageJson = generatePackageJson(config.packageName, version, versionConfig, config.packageTemplate);
    const packageJsonPath = path.join(versionDir, 'package.json');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`  ✓ Created package.json`);
    
    // Generate tsconfig.json
    const tsConfig = generateTsConfig();
    const tsConfigPath = path.join(versionDir, 'tsconfig.json');
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
    console.log(`  ✓ Created tsconfig.json`);
    
    // Generate tsconfig.esm.json
    const tsConfigEsm = generateTsConfigEsm();
    const tsConfigEsmPath = path.join(versionDir, 'tsconfig.esm.json');
    fs.writeFileSync(tsConfigEsmPath, JSON.stringify(tsConfigEsm, null, 2));
    console.log(`  ✓ Created tsconfig.esm.json`);
    
    // Update README with package name and npm tag
    updateReadmeWithPackageName(version, config.packageName, versionConfig.npmTag);
    
    console.log('');
  }
  
  console.log('Done! Package files have been generated for all versions.');
}

function updateReadmeWithPackageName(version: string, packageName: string, npmTag: string): void {
  const versionDir = path.join(VERSIONS_DIR, version);
  const readmePath = path.join(versionDir, 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    return;
  }
  
  let content = fs.readFileSync(readmePath, 'utf-8');
  
  // Remove any existing installation sections
  content = content.replace(/## Installation[\s\S]*?(?=##|$)/gm, '');
  
  // Add installation instructions at the beginning
  const installSection = `## Installation

\`\`\`bash
# Install specific version using npm tag
npm install ${packageName}@${npmTag}

# Or using yarn
yarn add ${packageName}@${npmTag}
\`\`\`

`;
  
  // Insert after the title
  const lines = content.split('\n');
  const titleIndex = lines.findIndex(line => line.startsWith('# '));
  if (titleIndex !== -1) {
    // Find the next non-empty line after title
    let insertIndex = titleIndex + 1;
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }
    lines.splice(insertIndex, 0, installSection);
    content = lines.join('\n');
  }
  
  // Update import examples
  content = content.replace(/from '\.\/index'/g, `from '${packageName}'`);
  content = content.replace(/from 'pgsql-deparser-v\d+'/g, `from '${packageName}'`);
  
  fs.writeFileSync(readmePath, content);
  console.log(`  ✓ Updated README.md with package name`);
}

// Run the script
generateVersionPackages();