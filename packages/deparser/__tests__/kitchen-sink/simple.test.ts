
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('simple', () => {
  fixtures.runFixtureTests([
  "simple-1.sql",
  "simple-2.sql",
  "simple-3.sql",
  "simple-4.sql",
  "simple-5.sql",
  "simple-6.sql",
  "simple-7.sql",
  "simple-8.sql",
  "simple-9.sql",
  "simple-10.sql",
  "simple-11.sql",
  "simple-12.sql",
  "simple-13.sql",
  "simple-14.sql",
  "simple-15.sql",
  "simple-16.sql",
  "simple-17.sql",
  "simple-18.sql"
]);
});
