
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('query-003', () => {
  fixtures.runFixtureTests([
  "query-003-1.sql"
]);
});
