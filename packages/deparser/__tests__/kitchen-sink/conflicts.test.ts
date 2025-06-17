
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('conflicts', () => {
  fixtures.runFixtureTests([
  "conflicts-1.sql",
  "conflicts-2.sql",
  "conflicts-3.sql",
  "conflicts-4.sql",
  "conflicts-5.sql"
]);
});
