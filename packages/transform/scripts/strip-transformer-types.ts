import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script to strip types from transformer files and replace them with 'any'
 * This creates lightweight versions of the transformers for better tree-shaking
 */

const TRANSFORMER_FILES = [
  'src/transformers/v13-to-v14.ts',
  'src/transformers/v14-to-v15.ts',
  'src/transformers/v15-to-v16.ts',
  'src/transformers/v16-to-v17.ts'
];

const OUTPUT_DIR = 'versions';

// Types to strip and replace with 'any'
const TYPES_TO_STRIP = [
  'PG13', 'PG14', 'PG15', 'PG16', 'PG17',
  'V13Types', 'V14Types', 'V15Types', 'V16Types', 'V17Types',
  'TransformerContext'
];

function stripTypes(sourceFile: ts.SourceFile): string {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    const visit: ts.Visitor = (node) => {
      // Remove import declarations for type modules
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier)) {
          const importPath = moduleSpecifier.text;
          // Remove imports for version-specific types and context
          if (importPath.includes('/types') || importPath.includes('/context')) {
            return undefined;
          }
        }
      }

      // Replace type references with 'any'
      if (ts.isTypeReferenceNode(node)) {
        const typeName = node.typeName.getText();
        
        // Check if it's a qualified name (e.g., PG13.Node)
        if (typeName.includes('.')) {
          const [namespace] = typeName.split('.');
          if (TYPES_TO_STRIP.includes(namespace)) {
            return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
          }
        }
        
        // Check for TransformerContext
        if (typeName === 'TransformerContext') {
          return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
        }
      }

      // Replace parameter type annotations
      if (ts.isParameter(node) && node.type) {
        const typeText = node.type.getText();
        if (TYPES_TO_STRIP.some(type => typeText.includes(type))) {
          return ts.factory.updateParameterDeclaration(
            node,
            node.modifiers,
            node.dotDotDotToken,
            node.name,
            node.questionToken,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            node.initializer
          );
        }
      }

      // Replace variable type annotations
      if (ts.isVariableDeclaration(node) && node.type) {
        const typeText = node.type.getText();
        if (TYPES_TO_STRIP.some(type => typeText.includes(type))) {
          return ts.factory.updateVariableDeclaration(
            node,
            node.name,
            node.exclamationToken,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            node.initializer
          );
        }
      }

      // Replace return type annotations
      if ((ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node) || ts.isArrowFunction(node)) && node.type) {
        const typeText = node.type.getText();
        if (TYPES_TO_STRIP.some(type => typeText.includes(type))) {
          if (ts.isMethodDeclaration(node)) {
            return ts.factory.updateMethodDeclaration(
              node,
              node.modifiers,
              node.asteriskToken,
              node.name,
              node.questionToken,
              node.typeParameters,
              node.parameters,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
              node.body
            );
          } else if (ts.isFunctionDeclaration(node)) {
            return ts.factory.updateFunctionDeclaration(
              node,
              node.modifiers,
              node.asteriskToken,
              node.name,
              node.typeParameters,
              node.parameters,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
              node.body
            );
          } else if (ts.isArrowFunction(node)) {
            return ts.factory.updateArrowFunction(
              node,
              node.modifiers,
              node.typeParameters,
              node.parameters,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
              node.equalsGreaterThanToken,
              node.body
            );
          }
        }
      }

      // Replace type assertions
      if (ts.isAsExpression(node)) {
        const typeText = node.type.getText();
        if (TYPES_TO_STRIP.some(type => typeText.includes(type))) {
          return node.expression; // Remove the assertion entirely
        }
      }

      // Handle property declarations with types
      if (ts.isPropertyDeclaration(node) && node.type) {
        const typeText = node.type.getText();
        if (TYPES_TO_STRIP.some(type => typeText.includes(type))) {
          return ts.factory.updatePropertyDeclaration(
            node,
            node.modifiers,
            node.name,
            node.questionToken || node.exclamationToken,
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            node.initializer
          );
        }
      }

      // Handle interface declarations - remove them entirely
      if (ts.isInterfaceDeclaration(node)) {
        const name = node.name.getText();
        if (TYPES_TO_STRIP.some(type => name.includes(type))) {
          return undefined;
        }
      }

      // Handle type alias declarations - remove them entirely
      if (ts.isTypeAliasDeclaration(node)) {
        const name = node.name.getText();
        if (TYPES_TO_STRIP.some(type => name.includes(type))) {
          return undefined;
        }
      }

      return ts.visitEachChild(node, visit, context);
    };

    return (node) => ts.visitNode(node, visit) as ts.SourceFile;
  };

  const result = ts.transform(sourceFile, [transformer]);
  const transformedSourceFile = result.transformed[0];
  
  // Add header comment
  const headerComment = `/**
 * Auto-generated file with types stripped for better tree-shaking
 * DO NOT EDIT - Generated by strip-transformer-types.ts
 */

`;
  
  return headerComment + printer.printFile(transformedSourceFile);
}

function processFile(filePath: string): void {
  console.log(`Processing ${filePath}...`);
  
  const fullPath = path.join(process.cwd(), filePath);
  const sourceCode = fs.readFileSync(fullPath, 'utf-8');
  
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );
  
  const strippedCode = stripTypes(sourceFile);
  
  // Create output directory if it doesn't exist
  const outputPath = path.join(process.cwd(), OUTPUT_DIR);
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  
  // Write the stripped file
  const outputFileName = path.basename(filePath);
  const outputFilePath = path.join(outputPath, outputFileName);
  fs.writeFileSync(outputFilePath, strippedCode);
  
  console.log(`✓ Written to ${path.join(OUTPUT_DIR, outputFileName)}`);
}

function main() {
  console.log('Stripping types from transformer files...\n');
  
  for (const file of TRANSFORMER_FILES) {
    try {
      processFile(file);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
  
  console.log('\nDone! Stripped transformer files are in the versions/ directory.');
}

// Run the script
main();