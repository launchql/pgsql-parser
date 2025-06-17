
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('returns_table', () => {
  fixtures.runFixtureTests([
  "returns_table-1.sql"
]);
});
