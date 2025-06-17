
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('timetz', () => {
  fixtures.runFixtureTests([
  "timetz-1.sql",
  "timetz-2.sql",
  "timetz-3.sql",
  "timetz-4.sql",
  "timetz-5.sql",
  "timetz-6.sql",
  "timetz-7.sql",
  "timetz-8.sql",
  "timetz-9.sql",
  "timetz-10.sql",
  "timetz-11.sql",
  "timetz-12.sql",
  "timetz-13.sql",
  "timetz-14.sql",
  "timetz-15.sql",
  "timetz-16.sql",
  "timetz-17.sql",
  "timetz-18.sql",
  "timetz-19.sql",
  "timetz-20.sql"
]);
});
