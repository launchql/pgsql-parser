# Publishing Guide

This guide covers the multi-version publishing workflow for the pgsql-parser monorepo, which supports PostgreSQL versions 13-17 with version-specific npm tags.

## Prerequisites

Before publishing any packages, you must build the entire monorepo:

```bash
yarn && yarn build
```

This installs all dependencies and builds all packages in the correct order using Lerna.

## Multi-Version Publishing Overview

The pgsql-parser project uses a sophisticated multi-version publishing system to support different PostgreSQL versions. Each PostgreSQL version has its own:

- **Version numbers** for each package (parser, deparser, types)
- **npm tag** for publishing (pg13, pg14, pg15, pg16, pg17)
- **libpg-query dependency** version

All version mappings are centrally managed in `config/versions.json`:

```json
{
  "versions": {
    "13": {
      "libpg-query": "13.5.7",
      "pgsql-parser": "13.18.0", 
      "pgsql-deparser": "13.17.0",
      "@pgsql/types": "13.11.1",
      "npmTag": "pg13"
    },
    "17": {
      "libpg-query": "17.5.5",
      "pgsql-parser": "17.7.5",
      "pgsql-deparser": "17.8.3", 
      "@pgsql/types": "17.6.1",
      "npmTag": "pg17"
    }
  }
}
```

### 0. Bump the config versions

In the root:

```
yarn bump-versions
```

## Package Publishing Workflows

### 1. Parser Package (`pgsql-parser`)

The parser package uses a version preparation script to generate multiple version-specific packages.

#### Prepare Versions
```bash
cd packages/parser
npm run prepare-versions
```

This script (`scripts/prepare-versions.ts`):
- Reads version configuration from `config/versions.json`
- Creates version-specific directories in `packages/parser/versions/`
- Generates `package.json`, `tsconfig.json`, and source files for each PostgreSQL version
- Each version gets its own libpg-query dependency and npm tag

#### Build and Publish Individual Versions
```bash
# Navigate to a specific version directory
cd packages/parser/versions/17

# Build the package
npm run build

# Publish with the correct tag
npm publish --tag pg17
```

#### Publish All Parser Versions
```bash
cd packages/parser

# Prepare all versions
npm run prepare-versions

# Build and publish each version
for version in versions/*/; do
  cd "$version"
  npm run build
  npm run publish:pkg  # Uses the npmTag from config
  cd ..
done
```

### 2. Deparser Package (`pgsql-deparser`)

The deparser package uses a template-based approach for multi-version publishing.

#### Prepare Versions
```bash
cd packages/deparser
npm run prepare-versions
```

This runs a complete preparation pipeline:
1. `strip-transformer-types` - Clean up transformer types
2. `strip-direct-transformer-types` - Clean up direct transformer types  
3. `strip-deparser-types` - Clean up deparser types
4. `organize-transformers` - Organize transformers by version
5. `generate-version-deparsers` - Generate version-specific deparsers
6. `generate-packages` - Generate package.json files for each version

The `generate-packages` script (`scripts/generate-version-packages.ts`):
- Uses the template from `config/deparser-versions.json`
- Creates version-specific packages in `packages/deparser/versions/`
- Sets up proper dependencies and npm tags for each PostgreSQL version

#### Build and Publish Individual Versions
```bash
# Navigate to a specific version directory
cd packages/deparser/versions/17

# Build the package
npm run build

# Publish with the correct tag
npm publish --tag pg17
```

#### Publish All Deparser Versions
```bash
cd packages/deparser

# Prepare all versions
npm run prepare-versions

# Build and publish each version
for version in versions/*/; do
  cd "$version"
  npm run build
  npm run publish:pkg  # Uses the npmTag from config
  cd ..
done
```

### 3. Other Packages

For packages without multi-version publishing (utils, traverse, cli, etc.):

```bash
cd packages/{package-name}
npm run build
npm publish
```

## Lerna Publishing

For coordinated publishing across the entire monorepo:

```bash
# Publish all packages that have changed
lerna publish

# Publish with a specific version bump
lerna publish major|minor|patch

# Publish from a specific branch (main only by default)
lerna publish --allow-branch main
```

The Lerna configuration (`lerna.json`) is set up with:
- Independent versioning for each package
- Conventional commits for automatic changelog generation
- Restricted to publishing from the `main` branch

## Complete Publishing Procedure

### For a New Release

1. **Update version configuration** in `config/versions.json` if needed
2. **Build the monorepo**:
   ```bash
   yarn && yarn build
   ```

3. **Prepare multi-version packages**:
   ```bash
   # Parser versions
   cd packages/parser && npm run prepare-versions && cd ../..
   
   # Deparser versions  
   cd packages/deparser && npm run prepare-versions && cd ../..
   ```

4. **Publish packages** (choose one approach):

   **Option A: Individual package publishing**
   ```bash
   # Publish parser versions
   cd packages/parser
   for version in versions/*/; do
     cd "$version" && npm run build && npm run publish:pkg && cd ..
   done
   cd ../..
   
   # Publish deparser versions
   cd packages/deparser  
   for version in versions/*/; do
     cd "$version" && npm run build && npm run publish:pkg && cd ..
   done
   cd ../..
   
   # Publish other packages
   cd packages/utils && npm run build && npm publish && cd ../..
   cd packages/traverse && npm run build && npm publish && cd ../..
   # ... repeat for other packages
   ```

   **Option B: Lerna coordinated publishing**
   ```bash
   lerna publish
   ```

### For Emergency Patches

1. **Create a patch branch** from the target version
2. **Apply fixes** to the relevant packages
3. **Update version numbers** in `config/versions.json`
4. **Follow the complete publishing procedure** above

## Troubleshooting

### Common Issues

**Build failures**: Ensure you've run `yarn && yarn build` in the root directory first.

**Version conflicts**: Check that `config/versions.json` has consistent version numbers across all packages.

**npm tag issues**: Verify that the npmTag in the configuration matches what you're publishing with.

**Permission errors**: Ensure you're logged into npm with an account that has publish permissions for the `@pgsql` scope and `pgsql-*` packages.

### Verification

After publishing, verify the packages are available:

```bash
# Check latest versions
npm view pgsql-parser dist-tags
npm view pgsql-deparser dist-tags

# Check specific version tags
npm view pgsql-parser@pg17
npm view pgsql-deparser@pg17
```

## Package Dependencies

The multi-version system maintains these relationships:
- `pgsql-parser` depends on `libpg-query`, `pgsql-deparser`, and `@pgsql/types`
- `pgsql-deparser` depends only on `@pgsql/types`
- All versions must be compatible within the same PostgreSQL version

When updating versions, ensure all related packages are updated together to maintain compatibility.