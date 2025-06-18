
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-statements-delete', () => {
  fixtures.runFixtureTests([
  "original/statements/delete-1.sql",
  "original/statements/delete-2.sql",
  "original/statements/delete-3.sql",
  "original/statements/delete-4.sql"
]);
});
