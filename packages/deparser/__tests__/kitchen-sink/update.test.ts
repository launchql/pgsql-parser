
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('update', () => {
  fixtures.runFixtureTests([
  "update-1.sql",
  "update-2.sql",
  "update-3.sql",
  "update-4.sql",
  "update-5.sql",
  "update-6.sql",
  "update-7.sql",
  "update-8.sql",
  "update-9.sql",
  "update-10.sql",
  "update-11.sql",
  "update-12.sql"
]);
});
