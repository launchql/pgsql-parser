
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('time', () => {
  fixtures.runFixtureTests([
  "time-1.sql",
  "time-2.sql",
  "time-3.sql",
  "time-4.sql",
  "time-5.sql",
  "time-6.sql",
  "time-7.sql",
  "time-8.sql",
  "time-9.sql",
  "time-10.sql",
  "time-11.sql",
  "time-12.sql",
  "time-13.sql",
  "time-14.sql",
  "time-15.sql",
  "time-16.sql",
  "time-17.sql",
  "time-18.sql"
]);
});
