
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('create_am', () => {
  fixtures.runFixtureTests([
  "create_am-1.sql",
  "create_am-2.sql",
  "create_am-3.sql",
  "create_am-4.sql",
  "create_am-5.sql",
  "create_am-6.sql",
  "create_am-7.sql",
  "create_am-8.sql",
  "create_am-9.sql",
  "create_am-10.sql",
  "create_am-11.sql",
  "create_am-12.sql",
  "create_am-13.sql",
  "create_am-14.sql",
  "create_am-15.sql",
  "create_am-16.sql",
  "create_am-17.sql",
  "create_am-18.sql"
]);
});
