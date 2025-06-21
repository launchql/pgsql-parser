
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-functions-basic', async () => {
  await fixtures.runFixtureTests([
  "original/functions/basic-1.sql",
  "original/functions/basic-2.sql"
]);
});
