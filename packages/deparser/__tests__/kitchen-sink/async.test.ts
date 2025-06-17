
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('async', () => {
  fixtures.runFixtureTests([
  "async-1.sql",
  "async-2.sql",
  "async-3.sql",
  "async-4.sql",
  "async-5.sql",
  "async-6.sql",
  "async-7.sql",
  "async-8.sql",
  "async-9.sql",
  "async-10.sql",
  "async-11.sql"
]);
});
