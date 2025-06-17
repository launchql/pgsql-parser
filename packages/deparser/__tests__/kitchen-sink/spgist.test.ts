
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('spgist', () => {
  fixtures.runFixtureTests([
  "spgist-1.sql",
  "spgist-2.sql",
  "spgist-3.sql",
  "spgist-4.sql",
  "spgist-5.sql",
  "spgist-6.sql",
  "spgist-7.sql",
  "spgist-8.sql",
  "spgist-9.sql",
  "spgist-10.sql",
  "spgist-11.sql",
  "spgist-12.sql",
  "spgist-13.sql",
  "spgist-14.sql"
]);
});
