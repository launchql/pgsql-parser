
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-views-create', () => {
  fixtures.runFixtureTests([
  "original/views/create-1.sql",
  "original/views/create-2.sql",
  "original/views/create-3.sql",
  "original/views/create-4.sql"
]);
});
