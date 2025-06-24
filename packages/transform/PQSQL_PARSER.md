this is from the source of the `@pgsql/parser` repo so you can see the API.


```ts
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const { Parser } = require('../wasm/index.cjs');

describe('Parser', () => {
  describe('Dynamic API', () => {
    it('should parse SQL with default version', async () => {
      const parser = new Parser();
      const result = await parser.parse('SELECT 1+1 as sum');
      assert.ok(result);
      assert.ok(result.stmts);
      assert.equal(result.stmts.length, 1);
    });

    it('should parse SQL with specific version', async () => {
      // Get available versions from the Parser class
      const parser = new Parser();
      const defaultVersion = parser.version;
      
      // Test with a different version if available
      const testVersion = defaultVersion === 17 ? 16 : 15;
      try {
        const versionParser = new Parser(testVersion);
        const result = await versionParser.parse('SELECT 1+1 as sum');
        assert.equal(versionParser.version, testVersion);
        assert.ok(result);
      } catch (e) {
        // Version might not be available in this build
        console.log(`Version ${testVersion} not available in this build`);
      }
    });

    it('should handle parse errors', async () => {
      const parser = new Parser();
      try {
        await parser.parse('INVALID SQL');
        assert.fail('Should have thrown an error');
      } catch (error) {
        assert.ok(error);
        assert.ok(error.message.includes('syntax error'));
      }
    });

    it('should work with Parser class', async () => {
      const parser = new Parser();
      const result = await parser.parse('SELECT * FROM users');
      assert.ok(result);
      assert.ok(result.stmts);
    });

    it('should validate version in constructor', () => {
      // Test invalid version
      assert.throws(() => {
        new Parser(99);
      }, /Unsupported PostgreSQL version/);
    });

    it('should support parseSync after initial parse', async () => {
      const parser = new Parser();
      
      // First parse to initialize
      await parser.parse('SELECT 1');
      
      // Now parseSync should work
      const result = parser.parseSync('SELECT 2+2 as sum');
      assert.ok(result);
      assert.ok(result.stmts);
      assert.equal(result.stmts.length, 1);
    });
  });

  describe('Version-specific imports', () => {
    // Dynamically test available version imports
    const versions = [13, 14, 15, 16, 17];
    
    for (const version of versions) {
      it(`should parse with v${version} if available`, async () => {
        try {
          const versionModule = require(`../wasm/v${version}.cjs`);
          await versionModule.loadModule();
          const result = await versionModule.parse('SELECT 1');
          assert.ok(result);
          assert.equal(result.stmts.length, 1);
        } catch (e) {
          // Version not available in this build
          console.log(`Version ${version} not available in this build`);
        }
      });
    }
  });
});
```