
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('composite', () => {
  fixtures.runFixtureTests([
  "composite-1.sql"
]);
});
