
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-grants-custom', () => {
  fixtures.runFixtureTests([
  "original/grants/custom-1.sql",
  "original/grants/custom-2.sql",
  "original/grants/custom-3.sql",
  "original/grants/custom-4.sql",
  "original/grants/custom-5.sql",
  "original/grants/custom-6.sql",
  "original/grants/custom-7.sql",
  "original/grants/custom-8.sql",
  "original/grants/custom-9.sql",
  "original/grants/custom-10.sql",
  "original/grants/custom-11.sql",
  "original/grants/custom-12.sql",
  "original/grants/custom-13.sql"
]);
});
