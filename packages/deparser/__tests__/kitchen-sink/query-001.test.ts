
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('query-001', () => {
  fixtures.runFixtureTests([
  "query-001-1.sql"
]);
});
