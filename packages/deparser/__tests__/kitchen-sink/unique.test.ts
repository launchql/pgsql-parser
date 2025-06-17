
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('unique', () => {
  fixtures.runFixtureTests([
  "unique-1.sql",
  "unique-2.sql",
  "unique-3.sql",
  "unique-4.sql"
]);
});
