
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-preceeding', async () => {
  await fixtures.runFixtureTests([
  "original/preceeding-1.sql"
]);
});
