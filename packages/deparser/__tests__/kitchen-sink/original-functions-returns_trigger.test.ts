
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-functions-returns_trigger', () => {
  fixtures.runFixtureTests([
  "original/functions/returns_trigger-1.sql"
]);
});
