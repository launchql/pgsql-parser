
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(16, 17);

it('pretty-constraints', async () => {
  await fixtures.runFixtureTests([
  "pretty/constraints-1.sql",
  "pretty/constraints-2.sql",
  "pretty/constraints-3.sql",
  "pretty/constraints-4.sql"
]);
});
