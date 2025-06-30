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
  // Start with the template and override only the version-specific fields
  const packageJson: any = {
    ...template,
    name: packageName,
    version: versionConfig.deparserVersion,
    dependencies: {
      [`@pgsql/types`]: `^${versionConfig.typesVersion}`
    }
  };
  
  return packageJson;
}

function generateTsConfig(): any {
  return {
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
    "include": ["src/**/*.ts"],
    "exclude": ["dist", "node_modules", "**/*.spec.*", "**/*.test.*"]
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
    

    
    console.log('');
  }
  
  console.log('Done! Package files have been generated for all versions.');
}



// Run the script
generateVersionPackages();