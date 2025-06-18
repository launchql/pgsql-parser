
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-statements-conflicts', () => {
  fixtures.runFixtureTests([
  "original/statements/conflicts-1.sql",
  "original/statements/conflicts-2.sql",
  "original/statements/conflicts-3.sql",
  "original/statements/conflicts-4.sql",
  "original/statements/conflicts-5.sql"
]);
});
