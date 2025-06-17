
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('on_update', () => {
  fixtures.runFixtureTests([
  "on_update-1.sql"
]);
});
