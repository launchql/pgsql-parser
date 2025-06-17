
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('preceeding', () => {
  fixtures.runFixtureTests([
  "preceeding-1.sql"
]);
});
