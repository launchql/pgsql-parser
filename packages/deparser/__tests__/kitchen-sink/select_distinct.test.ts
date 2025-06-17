
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('select_distinct', () => {
  fixtures.runFixtureTests([
  "select_distinct-1.sql",
  "select_distinct-2.sql",
  "select_distinct-3.sql",
  "select_distinct-4.sql",
  "select_distinct-5.sql",
  "select_distinct-6.sql",
  "select_distinct-7.sql",
  "select_distinct-8.sql",
  "select_distinct-9.sql",
  "select_distinct-10.sql",
  "select_distinct-11.sql",
  "select_distinct-12.sql",
  "select_distinct-13.sql",
  "select_distinct-14.sql",
  "select_distinct-15.sql",
  "select_distinct-16.sql",
  "select_distinct-17.sql",
  "select_distinct-18.sql",
  "select_distinct-19.sql",
  "select_distinct-20.sql",
  "select_distinct-21.sql",
  "select_distinct-22.sql"
]);
});
