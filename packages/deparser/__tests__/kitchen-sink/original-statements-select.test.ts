
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-statements-select', () => {
  fixtures.runFixtureTests([
  "original/statements/select-1.sql",
  "original/statements/select-2.sql",
  "original/statements/select-3.sql"
]);
});
