
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('create', () => {
  fixtures.runFixtureTests([
  "create-1.sql",
  "create-2.sql"
]);
});
