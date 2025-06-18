
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-indexes-custom', () => {
  fixtures.runFixtureTests([
  "original/indexes/custom-1.sql",
  "original/indexes/custom-2.sql",
  "original/indexes/custom-3.sql",
  "original/indexes/custom-4.sql",
  "original/indexes/custom-5.sql",
  "original/indexes/custom-6.sql",
  "original/indexes/custom-7.sql",
  "original/indexes/custom-8.sql",
  "original/indexes/custom-9.sql",
  "original/indexes/custom-10.sql",
  "original/indexes/custom-11.sql"
]);
});
