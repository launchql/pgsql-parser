
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('query-002', () => {
  fixtures.runFixtureTests([
  "query-002-1.sql"
]);
});
