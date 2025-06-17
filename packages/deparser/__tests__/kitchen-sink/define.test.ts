
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('define', () => {
  fixtures.runFixtureTests([
  "define-1.sql"
]);
});
