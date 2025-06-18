
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-amutils', () => {
  fixtures.runFixtureTests([
  "amutils-1.sql",
  "amutils-2.sql",
  "amutils-3.sql",
  "amutils-4.sql",
  "amutils-5.sql",
  "amutils-6.sql",
  "amutils-7.sql",
  "amutils-8.sql",
  "amutils-9.sql",
  "amutils-10.sql"
]);
});
