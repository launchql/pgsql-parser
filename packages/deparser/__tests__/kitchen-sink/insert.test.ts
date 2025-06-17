
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('insert', () => {
  fixtures.runFixtureTests([
  "insert-1.sql",
  "insert-2.sql",
  "insert-3.sql",
  "insert-4.sql",
  "insert-5.sql",
  "insert-6.sql"
]);
});
