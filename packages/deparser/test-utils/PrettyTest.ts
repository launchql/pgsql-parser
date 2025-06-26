import { expectParseDeparse } from './index';

const generateCoded = require('../../../__fixtures__/generated/generated.json');

export class PrettyTest {
  private testCases: string[];
  private testPrefix: string;

  constructor(testCases: string[], testPrefix: string = 'test') {
    this.testCases = testCases;
    this.testPrefix = testPrefix;
  }

  /**
   * Generate individual tests for each test case with both pretty and non-pretty formatting
   */
  generateTests(): void {
    this.testCases.forEach((key, index) => {
      const sql = generateCoded[key];
      const testName = `${this.testPrefix}-${index + 1}`;

      it(`should format ${testName}: ${key} (pretty)`, async () => {
        const result = await expectParseDeparse(sql, { pretty: true });
        expect(result).toMatchSnapshot();
      });

      it(`should format ${testName}: ${key} (non-pretty)`, async () => {
        const result = await expectParseDeparse(sql, { pretty: false });
        expect(result).toMatchSnapshot();
      });
    });
  }

  /**
   * Generate tests with custom test name extraction
   */
  generateTestsWithCustomNaming(nameExtractor: (key: string, index: number) => string): void {
    this.testCases.forEach((key, index) => {
      const sql = generateCoded[key];
      const testName = nameExtractor(key, index);

      it(`should format ${testName}: ${key} (pretty)`, async () => {
        const result = await expectParseDeparse(sql, { pretty: true });
        expect(result).toMatchSnapshot();
      });

      it(`should format ${testName}: ${key} (non-pretty)`, async () => {
        const result = await expectParseDeparse(sql, { pretty: false });
        expect(result).toMatchSnapshot();
      });
    });
  }

  /**
   * Generate a single AST validation test for all test cases
   */
  generateASTValidationTest(): void {
    it('should validate AST equivalence for all test cases', async () => {
      const allSql = this.testCases.map((key) => generateCoded[key]);
      
      for (const sql of allSql) {
        await expectParseDeparse(sql, { pretty: false });
        await expectParseDeparse(sql, { pretty: true });
      }
    });
  }
} 