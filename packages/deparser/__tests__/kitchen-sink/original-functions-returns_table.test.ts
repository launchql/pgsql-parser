
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-functions-returns_table', () => {
  fixtures.runFixtureTests([
  "original/functions/returns_table-1.sql"
]);
});
