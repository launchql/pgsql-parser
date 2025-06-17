
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('parens', () => {
  fixtures.runFixtureTests([
  "parens-1.sql",
  "parens-2.sql",
  "parens-3.sql",
  "parens-4.sql",
  "parens-5.sql",
  "parens-6.sql",
  "parens-7.sql",
  "parens-8.sql",
  "parens-9.sql",
  "parens-10.sql",
  "parens-11.sql",
  "parens-12.sql"
]);
});
