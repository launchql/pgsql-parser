
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('original-triggers-custom', () => {
  fixtures.runFixtureTests([
  "original/triggers/custom-1.sql",
  "original/triggers/custom-2.sql",
  "original/triggers/custom-3.sql",
  "original/triggers/custom-4.sql",
  "original/triggers/custom-5.sql",
  "original/triggers/custom-6.sql",
  "original/triggers/custom-7.sql",
  "original/triggers/custom-8.sql",
  "original/triggers/custom-9.sql",
  "original/triggers/custom-10.sql",
  "original/triggers/custom-11.sql"
]);
});
