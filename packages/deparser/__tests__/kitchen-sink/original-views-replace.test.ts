
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-views-replace', async () => {
  await fixtures.runFixtureTests([
  "original/views/replace-1.sql"
]);
});
