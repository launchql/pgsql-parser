
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('misc-issues', async () => {
  await fixtures.runFixtureTests([
  "misc/issues-1.sql",
  "misc/issues-2.sql",
  "misc/issues-3.sql",
  "misc/issues-4.sql",
  "misc/issues-5.sql"
]);
});
