
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-define', async () => {
  await fixtures.runFixtureTests([
  "original/define-1.sql"
]);
});
