
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('temp', () => {
  fixtures.runFixtureTests([
  "temp-1.sql",
  "temp-2.sql",
  "temp-3.sql",
  "temp-4.sql",
  "temp-5.sql",
  "temp-6.sql"
]);
});
