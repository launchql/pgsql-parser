
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('misc', () => {
  fixtures.runFixtureTests([
  "misc-1.sql",
  "misc-2.sql",
  "misc-3.sql",
  "misc-4.sql",
  "misc-5.sql",
  "misc-6.sql",
  "misc-7.sql",
  "misc-8.sql"
]);
});
