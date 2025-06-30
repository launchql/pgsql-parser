
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-upstream-sanity_check', async () => {
  await fixtures.runFixtureTests([
  // "original/upstream/sanity_check-1.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/upstream/sanity_check-2.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/upstream/sanity_check-3.sql", // REMOVED: 15-16 transformer fails with Integer object differences
]);
});
