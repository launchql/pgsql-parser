
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-types-composite', async () => {
  await fixtures.runFixtureTests([
  "original/types/composite-1.sql"
]);
});
