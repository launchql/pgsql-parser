
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('do', () => {
  fixtures.runFixtureTests([
  "do-1.sql",
  "do-2.sql",
  "do-3.sql"
]);
});
