
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('setof', () => {
  fixtures.runFixtureTests([
  "setof-1.sql",
  "setof-2.sql"
]);
});
