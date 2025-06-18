
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-statements-alias', () => {
  fixtures.runFixtureTests([
  "original/statements/alias-1.sql",
  "original/statements/alias-2.sql",
  "original/statements/alias-3.sql",
  "original/statements/alias-4.sql"
]);
});
