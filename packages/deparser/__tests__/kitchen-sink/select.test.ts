
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('select', () => {
  fixtures.runFixtureTests([
  "select-1.sql",
  "select-2.sql",
  "select-3.sql"
]);
});
