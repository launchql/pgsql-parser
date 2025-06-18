
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-views-replace', () => {
  fixtures.runFixtureTests([
  "original/views/replace-1.sql"
]);
});
