
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-functions-do', () => {
  fixtures.runFixtureTests([
  "original/functions/do-1.sql",
  "original/functions/do-2.sql",
  "original/functions/do-3.sql"
]);
});
