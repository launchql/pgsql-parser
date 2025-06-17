
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('defaults', () => {
  fixtures.runFixtureTests([
  "defaults-1.sql"
]);
});
