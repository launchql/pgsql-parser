
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('gin', () => {
  fixtures.runFixtureTests([
  "gin-1.sql",
  "gin-2.sql",
  "gin-3.sql",
  "gin-4.sql",
  "gin-5.sql",
  "gin-6.sql",
  "gin-7.sql",
  "gin-8.sql",
  "gin-9.sql",
  "gin-10.sql",
  "gin-11.sql",
  "gin-12.sql",
  "gin-13.sql",
  "gin-14.sql",
  "gin-15.sql"
]);
});
