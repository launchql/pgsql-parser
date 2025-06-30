import { Parser } from '@pgsql/parser';
import { 
  PG13ToPG17Transformer,
  PG14ToPG17Transformer,
  PG15ToPG17Transformer,
  PG16ToPG17Transformer
} from '../src/transformers-full';

describe('Direct Transformers', () => {
  const testSQL = 'SELECT id, name FROM users WHERE active = true';

  describe('PG16ToPG17Transformer', () => {
    it('should transform PG16 AST to PG17', async () => {
      const pg16Parser = new Parser({ version: 16 });
      
      const pg16Ast = await pg16Parser.parse(testSQL);
      const transformer = new PG16ToPG17Transformer();
      const transformedAst = transformer.transform(pg16Ast);
      
      expect(transformedAst.version).toBe(170004);
      expect(transformedAst.stmts).toBeDefined();
      expect(transformedAst.stmts.length).toBe(1);
      
      // Verify the structure is preserved
      expect(transformedAst.stmts[0].stmt).toBeDefined();
      const stmt = transformedAst.stmts[0].stmt as any;
      expect(stmt.SelectStmt).toBeDefined();
    });
  });

  describe('PG15ToPG17Transformer', () => {
    it('should transform PG15 AST to PG17', async () => {
      const pg15Parser = new Parser({ version: 15 });
      
      const pg15Ast = await pg15Parser.parse(testSQL);
      const transformer = new PG15ToPG17Transformer();
      const transformedAst = transformer.transform(pg15Ast);
      
      expect(transformedAst.version).toBe(170004);
      expect(transformedAst.stmts).toBeDefined();
      expect(transformedAst.stmts.length).toBe(1);
      
      // Verify the structure is preserved
      expect(transformedAst.stmts[0].stmt).toBeDefined();
      const stmt = transformedAst.stmts[0].stmt as any;
      expect(stmt.SelectStmt).toBeDefined();
    });
  });

  describe('PG14ToPG17Transformer', () => {
    it('should transform PG14 AST to PG17', async () => {
      const pg14Parser = new Parser({ version: 14 });
      
      const pg14Ast = await pg14Parser.parse(testSQL);
      const transformer = new PG14ToPG17Transformer();
      const transformedAst = transformer.transform(pg14Ast);
      
      expect(transformedAst.version).toBe(170004);
      expect(transformedAst.stmts).toBeDefined();
      expect(transformedAst.stmts.length).toBe(1);
      
      // Verify the structure is preserved
      expect(transformedAst.stmts[0].stmt).toBeDefined();
      const stmt = transformedAst.stmts[0].stmt as any;
      expect(stmt.SelectStmt).toBeDefined();
    });
  });

  describe('PG13ToPG17Transformer', () => {
    it('should transform PG13 AST to PG17', async () => {
      const pg13Parser = new Parser({ version: 13 });
      
      const pg13Ast = await pg13Parser.parse(testSQL);
      const transformer = new PG13ToPG17Transformer();
      const transformedAst = transformer.transform(pg13Ast);
      
      expect(transformedAst.version).toBe(170004);
      expect(transformedAst.stmts).toBeDefined();
      expect(transformedAst.stmts.length).toBe(1);
      
      // Verify the structure is preserved
      expect(transformedAst.stmts[0].stmt).toBeDefined();
      const stmt = transformedAst.stmts[0].stmt as any;
      expect(stmt.SelectStmt).toBeDefined();
    });
  });

  describe('transformStatement method', () => {
    it('should transform individual statements', async () => {
      const pg15Parser = new Parser({ version: 15 });
      const pg15Ast = await pg15Parser.parse(testSQL);
      
      const transformer = new PG15ToPG17Transformer();
      const stmt = pg15Ast.stmts[0].stmt;
      const transformedStmt = transformer.transformStatement(stmt);
      
      expect(transformedStmt).toBeDefined();
      // The transformed statement should have the same top-level structure
      expect(Object.keys(transformedStmt)).toEqual(Object.keys(stmt));
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid parse result', () => {
      const transformer = new PG15ToPG17Transformer();
      
      expect(() => transformer.transform(null as any)).toThrow('Invalid parse result');
      expect(() => transformer.transform({} as any)).toThrow('Invalid parse result');
      expect(() => transformer.transform({ version: 150001 } as any)).toThrow('Invalid parse result');
    });
  });
});