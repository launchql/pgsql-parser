
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('sequences', () => {
  fixtures.runFixtureTests([
  "sequences-1.sql",
  "sequences-2.sql",
  "sequences-3.sql",
  "sequences-4.sql",
  "sequences-5.sql"
]);
});
