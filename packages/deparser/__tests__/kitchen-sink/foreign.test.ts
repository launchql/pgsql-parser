
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('foreign', () => {
  fixtures.runFixtureTests([
  "foreign-1.sql",
  "foreign-2.sql",
  "foreign-3.sql",
  "foreign-4.sql",
  "foreign-5.sql",
  "foreign-6.sql"
]);
});
