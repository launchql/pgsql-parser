
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('latest-misc-quotes_etc', () => {
  fixtures.runFixtureTests([
  "latest/misc/quotes_etc-1.sql",
  "latest/misc/quotes_etc-2.sql"
]);
});
