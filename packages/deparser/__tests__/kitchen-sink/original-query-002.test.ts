
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-query-002', () => {
  fixtures.runFixtureTests([
  "original/query-002-1.sql"
]);
});
