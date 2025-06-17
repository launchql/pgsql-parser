
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('delete', () => {
  fixtures.runFixtureTests([
  "delete-1.sql",
  "delete-2.sql",
  "delete-3.sql",
  "delete-4.sql"
]);
});
