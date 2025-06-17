
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('replace', () => {
  fixtures.runFixtureTests([
  "replace-1.sql"
]);
});
