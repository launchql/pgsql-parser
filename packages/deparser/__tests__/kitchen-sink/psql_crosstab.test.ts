
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('psql_crosstab', () => {
  fixtures.runFixtureTests([
  "psql_crosstab-1.sql",
  "psql_crosstab-2.sql",
  "psql_crosstab-3.sql",
  "psql_crosstab-4.sql",
  "psql_crosstab-5.sql",
  "psql_crosstab-6.sql",
  "psql_crosstab-7.sql",
  "psql_crosstab-8.sql",
  "psql_crosstab-9.sql",
  "psql_crosstab-10.sql",
  "psql_crosstab-11.sql",
  "psql_crosstab-12.sql",
  "psql_crosstab-13.sql",
  "psql_crosstab-14.sql",
  "psql_crosstab-15.sql",
  "psql_crosstab-16.sql",
  "psql_crosstab-17.sql"
]);
});
