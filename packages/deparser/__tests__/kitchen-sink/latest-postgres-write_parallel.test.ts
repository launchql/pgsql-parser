
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-write_parallel', () => {
  fixtures.runFixtureTests([
  "write_parallel-1.sql",
  "write_parallel-2.sql",
  "write_parallel-3.sql",
  "write_parallel-4.sql",
  "write_parallel-5.sql",
  "write_parallel-6.sql",
  "write_parallel-7.sql",
  "write_parallel-8.sql",
  "write_parallel-9.sql",
  "write_parallel-10.sql",
  "write_parallel-11.sql",
  "write_parallel-12.sql",
  "write_parallel-13.sql",
  "write_parallel-14.sql",
  "write_parallel-15.sql",
  "write_parallel-16.sql",
  "write_parallel-17.sql",
  "write_parallel-18.sql",
  "write_parallel-19.sql",
  "write_parallel-20.sql",
  "write_parallel-21.sql",
  "write_parallel-22.sql"
]);
});
