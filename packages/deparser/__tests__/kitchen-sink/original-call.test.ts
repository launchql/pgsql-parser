
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-call', () => {
  fixtures.runFixtureTests([
  "original/call-1.sql",
  "original/call-2.sql",
  "original/call-3.sql"
]);
});
