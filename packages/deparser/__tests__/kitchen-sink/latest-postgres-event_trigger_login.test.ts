
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-event_trigger_login', async () => {
  await fixtures.runFixtureTests([]);
});
