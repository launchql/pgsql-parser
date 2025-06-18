
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-preceeding', () => {
  fixtures.runFixtureTests([
  "original/preceeding-1.sql"
]);
});
