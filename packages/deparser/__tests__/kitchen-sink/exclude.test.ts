
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('exclude', () => {
  fixtures.runFixtureTests([
  "exclude-1.sql",
  "exclude-2.sql"
]);
});
