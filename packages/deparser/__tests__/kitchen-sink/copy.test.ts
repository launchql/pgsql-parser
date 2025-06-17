
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('copy', () => {
  fixtures.runFixtureTests([
  "copy-1.sql"
]);
});
