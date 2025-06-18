
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-postgres-vacuum_parallel', () => {
  fixtures.runFixtureTests([
  "vacuum_parallel-1.sql",
  "vacuum_parallel-2.sql",
  "vacuum_parallel-3.sql",
  "vacuum_parallel-4.sql",
  "vacuum_parallel-5.sql",
  "vacuum_parallel-6.sql",
  "vacuum_parallel-7.sql",
  "vacuum_parallel-8.sql",
  "vacuum_parallel-9.sql",
  "vacuum_parallel-10.sql",
  "vacuum_parallel-11.sql",
  "vacuum_parallel-12.sql",
  "vacuum_parallel-13.sql",
  "vacuum_parallel-14.sql"
]);
});
