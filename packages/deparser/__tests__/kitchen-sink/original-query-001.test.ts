
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-query-001', () => {
  fixtures.runFixtureTests([
  "original/query-001-1.sql"
]);
});
