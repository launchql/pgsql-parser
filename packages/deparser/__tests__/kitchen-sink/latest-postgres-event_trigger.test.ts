
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-event_trigger', async () => {
  await fixtures.runFixtureTests([]);
});
