
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-functions-setof', () => {
  fixtures.runFixtureTests([
  "original/functions/setof-1.sql",
  "original/functions/setof-2.sql"
]);
});
