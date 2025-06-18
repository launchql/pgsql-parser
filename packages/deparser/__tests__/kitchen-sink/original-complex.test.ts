
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-complex', () => {
  fixtures.runFixtureTests([
  "original/complex-1.sql"
]);
});
