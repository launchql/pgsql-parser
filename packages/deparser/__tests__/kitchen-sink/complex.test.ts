
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('complex', () => {
  fixtures.runFixtureTests([
  "complex-1.sql"
]);
});
