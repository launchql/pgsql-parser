
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-statements-cte', () => {
  fixtures.runFixtureTests([
  "original/statements/cte-1.sql"
]);
});
