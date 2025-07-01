
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('misc-legacy', async () => {
  await fixtures.runFixtureTests([
  "misc/legacy-1.sql"
]);
});
