
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('basic', () => {
  fixtures.runFixtureTests([
  "basic-1.sql",
  "basic-2.sql"
]);
});
