
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('random', () => {
  fixtures.runFixtureTests([
  "random-1.sql",
  "random-2.sql",
  "random-3.sql",
  "random-4.sql",
  "random-5.sql",
  "random-6.sql",
  "random-7.sql",
  "random-8.sql"
]);
});
