
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('drop_operator', () => {
  fixtures.runFixtureTests([
  "drop_operator-1.sql",
  "drop_operator-2.sql",
  "drop_operator-3.sql",
  "drop_operator-4.sql",
  "drop_operator-5.sql",
  "drop_operator-6.sql",
  "drop_operator-7.sql",
  "drop_operator-8.sql",
  "drop_operator-9.sql",
  "drop_operator-10.sql",
  "drop_operator-11.sql",
  "drop_operator-12.sql"
]);
});
