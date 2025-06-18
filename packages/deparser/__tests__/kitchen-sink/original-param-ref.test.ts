
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-param-ref', () => {
  fixtures.runFixtureTests([
  "original/param-ref-1.sql",
  "original/param-ref-2.sql"
]);
});
