
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('lock', () => {
  fixtures.runFixtureTests([
  "lock-1.sql",
  "lock-2.sql",
  "lock-3.sql",
  "lock-4.sql",
  "lock-5.sql",
  "lock-6.sql",
  "lock-7.sql",
  "lock-8.sql",
  "lock-9.sql",
  "lock-10.sql",
  "lock-11.sql",
  "lock-12.sql",
  "lock-13.sql",
  "lock-14.sql",
  "lock-15.sql",
  "lock-16.sql",
  "lock-17.sql"
]);
});
