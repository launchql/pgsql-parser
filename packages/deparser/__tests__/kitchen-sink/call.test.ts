
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('call', () => {
  fixtures.runFixtureTests([
  "call-1.sql",
  "call-2.sql",
  "call-3.sql"
]);
});
