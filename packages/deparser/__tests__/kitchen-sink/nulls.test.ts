
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('nulls', () => {
  fixtures.runFixtureTests([
  "nulls-1.sql",
  "nulls-2.sql",
  "nulls-3.sql"
]);
});
