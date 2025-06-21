
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('misc-quotes_etc', async () => {
  await fixtures.runFixtureTests([
  "misc/quotes_etc-1.sql",
  "misc/quotes_etc-2.sql"
]);
});
