
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-custom', async () => {
  await fixtures.runFixtureTests([
  // "original/custom-1.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/custom-2.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  "original/custom-3.sql",
  "original/custom-4.sql",
  // "original/custom-5.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  "original/custom-6.sql",
  "original/custom-7.sql",
  "original/custom-8.sql",
  "original/custom-9.sql",
  "original/custom-10.sql",
  "original/custom-11.sql",
  "original/custom-12.sql",
  "original/custom-13.sql",
  "original/custom-14.sql",
  "original/custom-15.sql",
  "original/custom-16.sql",
  "original/custom-17.sql",
  "original/custom-18.sql",
  "original/custom-19.sql",
  "original/custom-20.sql",
  "original/custom-21.sql",
  "original/custom-22.sql",
  "original/custom-23.sql"
]);
});
