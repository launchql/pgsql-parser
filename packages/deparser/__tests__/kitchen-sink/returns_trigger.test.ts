
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('returns_trigger', () => {
  fixtures.runFixtureTests([
  "returns_trigger-1.sql"
]);
});
