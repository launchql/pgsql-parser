
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('cte', () => {
  fixtures.runFixtureTests([
  "cte-1.sql"
]);
});
