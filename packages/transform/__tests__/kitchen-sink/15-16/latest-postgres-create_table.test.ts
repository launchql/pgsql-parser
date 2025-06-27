
import { FixtureTestUtils } from '../../../test-utils';
const fixtures = new FixtureTestUtils(15, 16);

it('latest-postgres-create_table', async () => {
  await fixtures.runFixtureTests([
  "latest/postgres/create_table-1.sql",
  "latest/postgres/create_table-2.sql",
  "latest/postgres/create_table-3.sql",
  "latest/postgres/create_table-4.sql",
  "latest/postgres/create_table-5.sql",
  "latest/postgres/create_table-6.sql",
  "latest/postgres/create_table-7.sql",
  "latest/postgres/create_table-8.sql",
  "latest/postgres/create_table-9.sql",
  "latest/postgres/create_table-10.sql",
  "latest/postgres/create_table-11.sql",
  "latest/postgres/create_table-12.sql",
  "latest/postgres/create_table-13.sql",
  "latest/postgres/create_table-14.sql",
  "latest/postgres/create_table-15.sql",
  "latest/postgres/create_table-16.sql",
  "latest/postgres/create_table-17.sql",
  "latest/postgres/create_table-18.sql",
  "latest/postgres/create_table-19.sql",
  "latest/postgres/create_table-20.sql",
  "latest/postgres/create_table-21.sql",
  "latest/postgres/create_table-22.sql",
  "latest/postgres/create_table-23.sql",
  "latest/postgres/create_table-24.sql",
  "latest/postgres/create_table-25.sql",
  "latest/postgres/create_table-26.sql",
  "latest/postgres/create_table-27.sql",
  "latest/postgres/create_table-28.sql",
  "latest/postgres/create_table-29.sql",
  "latest/postgres/create_table-30.sql",
  "latest/postgres/create_table-31.sql",
  "latest/postgres/create_table-32.sql",
  "latest/postgres/create_table-33.sql",
  "latest/postgres/create_table-34.sql",
  "latest/postgres/create_table-35.sql",
  "latest/postgres/create_table-36.sql",
  "latest/postgres/create_table-37.sql",
  "latest/postgres/create_table-38.sql",
  "latest/postgres/create_table-39.sql",
  "latest/postgres/create_table-40.sql",
  "latest/postgres/create_table-41.sql"
]);
});
