
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('reltime', () => {
  fixtures.runFixtureTests([
  "reltime-1.sql",
  "reltime-2.sql",
  "reltime-3.sql",
  "reltime-4.sql",
  "reltime-5.sql",
  "reltime-6.sql",
  "reltime-7.sql",
  "reltime-8.sql",
  "reltime-9.sql",
  "reltime-10.sql",
  "reltime-11.sql",
  "reltime-12.sql",
  "reltime-13.sql",
  "reltime-14.sql",
  "reltime-15.sql",
  "reltime-16.sql",
  "reltime-17.sql"
]);
});
