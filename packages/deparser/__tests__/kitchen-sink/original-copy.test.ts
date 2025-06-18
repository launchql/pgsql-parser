
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-copy', () => {
  fixtures.runFixtureTests([
  "original/copy-1.sql"
]);
});
