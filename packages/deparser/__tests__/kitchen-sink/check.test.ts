
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('check', () => {
  fixtures.runFixtureTests([
  "check-1.sql",
  "check-2.sql",
  "check-3.sql",
  "check-4.sql",
  "check-5.sql",
  "check-6.sql",
  "check-7.sql",
  "check-8.sql",
  "check-9.sql"
]);
});
