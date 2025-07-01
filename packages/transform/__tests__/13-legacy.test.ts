import { Parser } from '@pgsql/parser';
import { 
  PG13ToPG17Transformer,
} from '../src/transformers-direct';
import { deparse } from 'pgsql-deparser';
import { LegacyFixtureTestUtils } from '../test-utils';
import * as PG13 from '../src/13/types';
import { cleanTree } from '../test-utils/clean-tree';

describe('Legacy 13 to 17 Direct Transformation Tests', () => {
  let legacyUtils: LegacyFixtureTestUtils;
  let pg13Parser: any;
  let transformer: PG13ToPG17Transformer;

  beforeAll(() => {
    legacyUtils = new LegacyFixtureTestUtils();
    pg13Parser = new Parser({ version: 13 });
    transformer = new PG13ToPG17Transformer();
  });

  it('should run all legacy tests', async () => {
    await legacyUtils.runAllLegacyTests(async (relativePath: string, sql: string) => {
      let pg13Ast: any;
      let transformedAst: any;
      let deparsed: string;
      let pg13Ast2: any;

      try {
        // Step 1: Parse with PG13
        console.log(`🔍 [${relativePath}] Step 1: Parsing SQL with PG13...`);
        console.log(`📝 SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
        
        pg13Ast = await pg13Parser.parse(sql);
        
        if (!pg13Ast) {
          throw new Error('PG13 parser returned null/undefined');
        }
        
        console.log(`✅ [${relativePath}] Step 1 SUCCESS: PG13 AST parsed (version: ${pg13Ast.version})`);
        expect(pg13Ast.version).toBe(130008);
        
      } catch (error) {
        const errorMsg = [
          `❌ [${relativePath}] Step 1 FAILED: PG13 Parse Error`,
          `📝 SQL: ${sql}`,
          `🔥 Error: ${error instanceof Error ? error.message : String(error)}`,
          `📊 Error Type: ${error instanceof Error ? error.constructor.name : typeof error}`,
          error instanceof Error && error.stack ? `📚 Stack: ${error.stack}` : ''
        ].filter(Boolean).join('\n   ');
        
        console.error(errorMsg);
        throw new Error(`PG13 Parse Failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      try {
        // Step 2: Transform PG13 → PG17
        console.log(`🔄 [${relativePath}] Step 2: Transforming PG13 → PG17...`);
        console.log(`📊 Input AST type: ${typeof pg13Ast}, statements: ${pg13Ast.stmts?.length || 'unknown'}`);
        
        transformedAst = transformer.transform(pg13Ast as any as PG13.ParseResult);
        
        if (!transformedAst) {
          throw new Error('Transformer returned null/undefined');
        }
        
        console.log(`✅ [${relativePath}] Step 2 SUCCESS: AST transformed (version: ${transformedAst.version})`);
        expect(transformedAst.version).toBe(170004);
        
      } catch (error) {
        const errorMsg = [
          `❌ [${relativePath}] Step 2 FAILED: Transformation Error`,
          `📝 Original SQL: ${sql}`,
          `📊 PG13 AST: ${JSON.stringify(pg13Ast, null, 2).substring(0, 500)}...`,
          `🔥 Error: ${error instanceof Error ? error.message : String(error)}`,
          `📊 Error Type: ${error instanceof Error ? error.constructor.name : typeof error}`,
          error instanceof Error && error.stack ? `📚 Stack: ${error.stack}` : ''
        ].filter(Boolean).join('\n   ');
        
        console.error(errorMsg);
        throw new Error(`Transformation Failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      try {
        // Step 3: Deparse transformed AST
        console.log(`📝 [${relativePath}] Step 3: Deparsing transformed AST...`);
        console.log(`📊 Transformed AST type: ${typeof transformedAst}, statements: ${transformedAst.stmts?.length || 'unknown'}`);
        
        deparsed = await deparse(transformedAst);
        
        if (!deparsed || typeof deparsed !== 'string') {
          throw new Error(`Deparser returned invalid result: ${typeof deparsed} - ${deparsed}`);
        }
        
        console.log(`✅ [${relativePath}] Step 3 SUCCESS: SQL deparsed (${deparsed.length} chars)`);
        console.log(`�� Deparsed SQL: ${deparsed.substring(0, 100)}${deparsed.length > 100 ? '...' : ''}`);
        expect(deparsed).toBeDefined();
        
      } catch (error) {
        const errorMsg = [
          `❌ [${relativePath}] Step 3 FAILED: Deparse Error`,
          `📝 Original SQL: ${sql}`,
          `📊 Transformed AST: ${JSON.stringify(transformedAst, null, 2).substring(0, 500)}...`,
          `🔥 Error: ${error instanceof Error ? error.message : String(error)}`,
          `📊 Error Type: ${error instanceof Error ? error.constructor.name : typeof error}`,
          error instanceof Error && error.stack ? `📚 Stack: ${error.stack}` : ''
        ].filter(Boolean).join('\n   ');
        
        console.error(errorMsg);
        throw new Error(`Deparse Failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      try {
        // Step 4: Parse deparsed SQL with PG13 again
        console.log(`🔍 [${relativePath}] Step 4: Re-parsing deparsed SQL with PG13...`);
        console.log(`📝 Deparsed SQL to parse: ${deparsed.substring(0, 100)}${deparsed.length > 100 ? '...' : ''}`);
        
        pg13Ast2 = await pg13Parser.parse(deparsed);
        
        if (!pg13Ast2) {
          throw new Error('PG13 parser returned null/undefined for deparsed SQL');
        }
        
        console.log(`✅ [${relativePath}] Step 4 SUCCESS: Deparsed SQL re-parsed (version: ${pg13Ast2.version})`);
        expect(pg13Ast2.version).toBe(130008);
        
      } catch (error) {
        const errorMsg = [
          `❌ [${relativePath}] Step 4 FAILED: Re-parse Error`,
          `📝 Original SQL: ${sql}`,
          `📝 Deparsed SQL: ${deparsed}`,
          `📊 Transformed AST: ${JSON.stringify(transformedAst, null, 2).substring(0, 300)}...`,
          `🔥 Error: ${error instanceof Error ? error.message : String(error)}`,
          `📊 Error Type: ${error instanceof Error ? error.constructor.name : typeof error}`,
          error instanceof Error && error.stack ? `📚 Stack: ${error.stack}` : ''
        ].filter(Boolean).join('\n   ');
        
        console.error(errorMsg);
        throw new Error(`Re-parse Failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      try {
        // Step 5: Compare cleaned ASTs for equality
        console.log(`⚖️  [${relativePath}] Step 5: Comparing AST equality...`);
        
        const cleanedOriginal = cleanTree(pg13Ast);
        const cleanedReparsed = cleanTree(pg13Ast2);
        
        console.log(`📊 Original AST statements: ${cleanedOriginal.stmts?.length || 'unknown'}`);
        console.log(`📊 Reparsed AST statements: ${cleanedReparsed.stmts?.length || 'unknown'}`);
        
        expect(cleanedReparsed).toEqual(cleanedOriginal);
        
        console.log(`✅ [${relativePath}] Step 5 SUCCESS: ASTs are equal after round-trip`);
        
      } catch (error) {
        const cleanedOriginal = cleanTree(pg13Ast);
        const cleanedReparsed = cleanTree(pg13Ast2);
        
        const errorMsg = [
          `❌ [${relativePath}] Step 5 FAILED: AST Equality Error`,
          `📝 Original SQL: ${sql}`,
          `📝 Deparsed SQL: ${deparsed}`,
          `📊 Original AST (cleaned): ${JSON.stringify(cleanedOriginal, null, 2).substring(0, 400)}...`,
          `📊 Reparsed AST (cleaned): ${JSON.stringify(cleanedReparsed, null, 2).substring(0, 400)}...`,
          `🔥 Error: ${error instanceof Error ? error.message : String(error)}`,
          `📊 Error Type: ${error instanceof Error ? error.constructor.name : typeof error}`,
          error instanceof Error && error.stack ? `📚 Stack: ${error.stack}` : ''
        ].filter(Boolean).join('\n   ');
        
        console.error(errorMsg);
        throw new Error(`AST Equality Failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      console.log(`🎉 [${relativePath}] ALL STEPS COMPLETED SUCCESSFULLY!`);
    });
  });

});

