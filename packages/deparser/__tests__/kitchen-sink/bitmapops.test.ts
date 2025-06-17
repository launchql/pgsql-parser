
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('bitmapops', () => {
  fixtures.runFixtureTests([
  "bitmapops-1.sql",
  "bitmapops-2.sql",
  "bitmapops-3.sql",
  "bitmapops-4.sql",
  "bitmapops-5.sql",
  "bitmapops-6.sql",
  "bitmapops-7.sql",
  "bitmapops-8.sql",
  "bitmapops-9.sql",
  "bitmapops-10.sql"
]);
});
