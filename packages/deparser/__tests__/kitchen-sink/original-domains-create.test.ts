
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-domains-create', async () => {
  await fixtures.runFixtureTests([
  "original/domains/create-1.sql",
  "original/domains/create-2.sql"
]);
});
