
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-sequences-alter', () => {
  fixtures.runFixtureTests([
  "original/sequences/alter-1.sql",
  "original/sequences/alter-2.sql",
  "original/sequences/alter-3.sql",
  "original/sequences/alter-4.sql",
  "original/sequences/alter-5.sql"
]);
});
