
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('alias', () => {
  fixtures.runFixtureTests([
  "alias-1.sql",
  "alias-2.sql",
  "alias-3.sql",
  "alias-4.sql"
]);
});
