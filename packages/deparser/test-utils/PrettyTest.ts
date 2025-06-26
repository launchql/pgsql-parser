import { expectParseDeparse } from './index';

const generateCoded = require('../../../__fixtures__/generated/generated.json');

export class PrettyTest {
  private testCases: string[];

  constructor(testCases: string[]) {
    this.testCases = testCases;
  }

  /**
   * Generate individual tests for each test case with both pretty and non-pretty formatting
   */
  generateTests(): void {
    this.testCases.forEach((testName, index) => {
      const sql = generateCoded[testName];

      it(`pretty: ${testName}`, async () => {
        const result = await expectParseDeparse(sql, { pretty: true });
        expect(result).toMatchSnapshot();
      });

      it(`non-pretty: ${testName}`, async () => {
        const result = await expectParseDeparse(sql, { pretty: false });
        expect(result).toMatchSnapshot();
      });
    });
  }

} 