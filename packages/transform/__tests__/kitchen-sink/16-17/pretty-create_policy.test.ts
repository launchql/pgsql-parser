
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(16, 17);

it('pretty-create_policy', async () => {
  await fixtures.runFixtureTests([
  "pretty/create_policy-1.sql",
  "pretty/create_policy-2.sql",
  "pretty/create_policy-3.sql",
  "pretty/create_policy-4.sql"
]);
});
