
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('on_delete', () => {
  fixtures.runFixtureTests([
  "on_delete-1.sql"
]);
});
