import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to organize transformers by source version
 * Creates a directory structure where each version has all transformers starting from that version
 */

interface TransformerMapping {
  sourceVersion: number;
  transformers: {
    fileName: string;
    className: string;
    targetVersion: number;
  }[];
}

const VERSIONS_DIR = 'versions';

// Define what transformers each version needs
const versionMappings: TransformerMapping[] = [
  {
    sourceVersion: 13,
    transformers: [
      { fileName: 'v13-to-v14.ts', className: 'V13ToV14Transformer', targetVersion: 14 },
      { fileName: 'direct/v13-to-v17.ts', className: 'PG13ToPG17Transformer', targetVersion: 17 }
    ]
  },
  {
    sourceVersion: 14,
    transformers: [
      { fileName: 'v14-to-v15.ts', className: 'V14ToV15Transformer', targetVersion: 15 },
      { fileName: 'direct/v14-to-v17.ts', className: 'PG14ToPG17Transformer', targetVersion: 17 }
    ]
  },
  {
    sourceVersion: 15,
    transformers: [
      { fileName: 'v15-to-v16.ts', className: 'V15ToV16Transformer', targetVersion: 16 },
      { fileName: 'direct/v15-to-v17.ts', className: 'PG15ToPG17Transformer', targetVersion: 17 }
    ]
  },
  {
    sourceVersion: 16,
    transformers: [
      { fileName: 'v16-to-v17.ts', className: 'V16ToV17Transformer', targetVersion: 17 },
      { fileName: 'direct/v16-to-v17.ts', className: 'PG16ToPG17Transformer', targetVersion: 17 }
    ]
  }
];

function copyTransformer(sourcePath: string, destPath: string): void {
  const content = fs.readFileSync(sourcePath, 'utf-8');
  fs.writeFileSync(destPath, content);
}

function createIndexFile(version: number, transformers: TransformerMapping['transformers']): string {
  const imports = transformers.map(t => {
    const importPath = `./${path.basename(t.fileName, '.ts')}`;
    return `export { ${t.className} } from '${importPath}';`;
  }).join('\n');

  return `/**
 * Transformers for PostgreSQL version ${version}
 * Auto-generated by organize-transformers-by-version.ts
 */

${imports}

// Export a convenience function to get all transformers for this version
export function getTransformersForV${version}() {
  return {
${transformers.map(t => `    to${t.targetVersion}: ${t.className}`).join(',\n')}
  };
}
`;
}

function copyReadme(versionDir: string): void {
  const sourcePath = path.join(__dirname, '..', 'README.md');
  const destPath = path.join(versionDir, 'README.md');
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
  }
}

function organizeByVersion(): void {
  console.log('Organizing transformers by version...\n');

  for (const mapping of versionMappings) {
    const versionDir = path.join(VERSIONS_DIR, mapping.sourceVersion.toString());
    const srcDir = path.join(versionDir, 'src');
    
    // Create version directory and src subdirectory
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir, { recursive: true });
    }

    console.log(`Processing version ${mapping.sourceVersion}...`);

    // Copy transformers to src directory
    for (const transformer of mapping.transformers) {
      const sourcePath = path.join(VERSIONS_DIR, transformer.fileName);
      let destFileName = path.basename(transformer.fileName);
      
      // Rename direct transformers to avoid conflicts
      if (transformer.fileName.startsWith('direct/')) {
        const match = destFileName.match(/v(\d+)-to-v(\d+)\.ts/);
        if (match) {
          destFileName = `v${match[1]}-to-v${match[2]}-direct.ts`;
        }
      }
      
      const destPath = path.join(srcDir, destFileName);

      if (fs.existsSync(sourcePath)) {
        copyTransformer(sourcePath, destPath);
        console.log(`  ✓ Copied ${destFileName}`);
      } else {
        console.warn(`  ⚠ Source file not found: ${sourcePath}`);
      }
    }

    // Create index file in src directory
    const indexContent = createIndexFile(mapping.sourceVersion, mapping.transformers);
    fs.writeFileSync(path.join(srcDir, 'index.js'), indexContent);
    console.log(`  ✓ Created index.js`);

    // Create README in version directory (not in src)
    copyReadme(versionDir);
    console.log(`  ✓ Created README.md`);

    console.log('');
  }

  // Also copy the base transformers that other versions might need
  console.log('Copying dependency transformers...');
  
  // v14 needs v14-to-v15 for its direct transformer
  const v14SrcDir = path.join(VERSIONS_DIR, '14', 'src');
  if (fs.existsSync(path.join(VERSIONS_DIR, 'v14-to-v15.ts'))) {
    copyTransformer(
      path.join(VERSIONS_DIR, 'v14-to-v15.ts'),
      path.join(v14SrcDir, 'v14-to-v15.ts')
    );
    console.log('  ✓ Copied v14-to-v15.ts to v14 directory (dependency)');
  }

  // v14 also needs v15-to-v16 and v16-to-v17
  if (fs.existsSync(path.join(VERSIONS_DIR, 'v15-to-v16.ts'))) {
    copyTransformer(
      path.join(VERSIONS_DIR, 'v15-to-v16.ts'),
      path.join(v14SrcDir, 'v15-to-v16.ts')
    );
    console.log('  ✓ Copied v15-to-v16.ts to v14 directory (dependency)');
  }

  if (fs.existsSync(path.join(VERSIONS_DIR, 'v16-to-v17.ts'))) {
    copyTransformer(
      path.join(VERSIONS_DIR, 'v16-to-v17.ts'),
      path.join(v14SrcDir, 'v16-to-v17.ts')
    );
    console.log('  ✓ Copied v16-to-v17.ts to v14 directory (dependency)');
  }

  // v13 needs all transformers for its direct transformer
  const v13SrcDir = path.join(VERSIONS_DIR, '13', 'src');
  const v13Dependencies = ['v13-to-v14.ts', 'v14-to-v15.ts', 'v15-to-v16.ts', 'v16-to-v17.ts'];
  for (const dep of v13Dependencies) {
    if (fs.existsSync(path.join(VERSIONS_DIR, dep))) {
      copyTransformer(
        path.join(VERSIONS_DIR, dep),
        path.join(v13SrcDir, dep)
      );
      console.log(`  ✓ Copied ${dep} to v13 directory (dependency)`);
    }
  }

  // v15 needs v15-to-v16 and v16-to-v17 for its direct transformer
  const v15SrcDir = path.join(VERSIONS_DIR, '15', 'src');
  const v15Dependencies = ['v15-to-v16.ts', 'v16-to-v17.ts'];
  for (const dep of v15Dependencies) {
    if (fs.existsSync(path.join(VERSIONS_DIR, dep))) {
      copyTransformer(
        path.join(VERSIONS_DIR, dep),
        path.join(v15SrcDir, dep)
      );
      console.log(`  ✓ Copied ${dep} to v15 directory (dependency)`);
    }
  }

  console.log('\nDone! Transformers are organized in version-specific directories.');
  
  // Copy deparser files
  console.log('\nCopying deparser files...');
  const { execSync } = require('child_process');
  try {
    execSync('npx ts-node scripts/strip-deparser-types.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to copy deparser files:', error);
  }
  
  // Now generate the deparser index files
  console.log('\nGenerating deparser index files...');
  try {
    execSync('npx ts-node scripts/generate-version-deparsers.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to generate deparser files:', error);
  }
  
  // Generate package.json files
  console.log('\nGenerating package.json files...');
  try {
    execSync('npx ts-node scripts/generate-version-packages.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to generate package files:', error);
  }
}

// Run the script
organizeByVersion();