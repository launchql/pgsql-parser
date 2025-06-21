
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-do-custom', async () => {
  await fixtures.runFixtureTests([
  "original/do/custom-1.sql"
]);
});
