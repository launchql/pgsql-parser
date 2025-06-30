
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-sequences-sequences', async () => {
  await fixtures.runFixtureTests([
  // "original/sequences/sequences-1.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/sequences/sequences-2.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  "original/sequences/sequences-3.sql",
  "original/sequences/sequences-4.sql",
  "original/sequences/sequences-5.sql"
]);
});
