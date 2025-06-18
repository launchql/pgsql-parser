
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-extensions-custom', () => {
  fixtures.runFixtureTests([
  "original/extensions/custom-1.sql",
  "original/extensions/custom-2.sql",
  "original/extensions/custom-3.sql"
]);
});
