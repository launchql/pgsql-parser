
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('path', () => {
  fixtures.runFixtureTests([
  "path-1.sql",
  "path-2.sql",
  "path-3.sql",
  "path-4.sql",
  "path-5.sql",
  "path-6.sql",
  "path-7.sql",
  "path-8.sql",
  "path-9.sql",
  "path-10.sql",
  "path-11.sql",
  "path-12.sql",
  "path-13.sql",
  "path-14.sql",
  "path-15.sql",
  "path-16.sql"
]);
});
