
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('pretty-misc', async () => {
  await fixtures.runFixtureTests([
  "pretty/misc-1.sql",
  "pretty/misc-2.sql",
  "pretty/misc-3.sql",
  "pretty/misc-4.sql",
  "pretty/misc-5.sql",
  "pretty/misc-6.sql"
]);
});
