
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-roles-create', () => {
  fixtures.runFixtureTests([
  "original/roles/create-1.sql",
  "original/roles/create-2.sql",
  "original/roles/create-3.sql",
  "original/roles/create-4.sql",
  "original/roles/create-5.sql",
  "original/roles/create-6.sql",
  "original/roles/create-7.sql"
]);
});
