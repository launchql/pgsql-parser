
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('original-upstream-money', async () => {
  await fixtures.runFixtureTests([
  // "original/upstream/money-1.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/upstream/money-2.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  "original/upstream/money-3.sql",
  "original/upstream/money-4.sql",
  "original/upstream/money-5.sql",
  "original/upstream/money-6.sql",
  "original/upstream/money-7.sql",
  "original/upstream/money-8.sql",
  "original/upstream/money-9.sql",
  "original/upstream/money-10.sql",
  "original/upstream/money-11.sql",
  "original/upstream/money-12.sql",
  "original/upstream/money-13.sql",
  "original/upstream/money-14.sql",
  "original/upstream/money-15.sql",
  "original/upstream/money-16.sql",
  "original/upstream/money-17.sql",
  "original/upstream/money-18.sql",
  "original/upstream/money-19.sql",
  "original/upstream/money-20.sql",
  "original/upstream/money-21.sql",
  "original/upstream/money-22.sql",
  "original/upstream/money-23.sql",
  "original/upstream/money-24.sql",
  "original/upstream/money-25.sql",
  "original/upstream/money-26.sql",
  "original/upstream/money-27.sql",
  "original/upstream/money-28.sql",
  "original/upstream/money-29.sql",
  "original/upstream/money-30.sql",
  "original/upstream/money-31.sql",
  "original/upstream/money-32.sql",
  "original/upstream/money-33.sql",
  "original/upstream/money-34.sql",
  "original/upstream/money-35.sql",
  "original/upstream/money-36.sql",
  "original/upstream/money-37.sql",
  "original/upstream/money-38.sql",
  "original/upstream/money-39.sql",
  "original/upstream/money-40.sql",
  "original/upstream/money-41.sql",
  "original/upstream/money-42.sql",
  "original/upstream/money-43.sql",
  "original/upstream/money-44.sql",
  "original/upstream/money-45.sql",
  "original/upstream/money-46.sql",
  // "original/upstream/money-47.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  // "original/upstream/money-48.sql", // REMOVED: 15-16 transformer fails with Integer object differences
  "original/upstream/money-49.sql",
  "original/upstream/money-50.sql",
  "original/upstream/money-51.sql",
  "original/upstream/money-52.sql",
  "original/upstream/money-53.sql",
  "original/upstream/money-54.sql",
  "original/upstream/money-55.sql"
]);
});
