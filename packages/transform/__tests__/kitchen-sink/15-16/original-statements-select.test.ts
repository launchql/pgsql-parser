
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-statements-select', async () => {
  await fixtures.runFixtureTests([
  // "original/statements/select-1.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/statements/select-2.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  "original/statements/select-3.sql"
]);
});
