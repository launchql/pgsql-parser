
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('brin', () => {
  fixtures.runFixtureTests([
  "brin-1.sql",
  "brin-2.sql",
  "brin-3.sql",
  "brin-4.sql",
  "brin-5.sql",
  "brin-6.sql",
  "brin-7.sql",
  "brin-8.sql",
  "brin-9.sql",
  "brin-10.sql",
  "brin-11.sql",
  "brin-12.sql",
  "brin-13.sql",
  "brin-14.sql"
]);
});
