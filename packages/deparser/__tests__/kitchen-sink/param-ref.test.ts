
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('param-ref', () => {
  fixtures.runFixtureTests([
  "param-ref-1.sql",
  "param-ref-2.sql"
]);
});
