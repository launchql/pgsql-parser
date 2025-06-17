
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('conversion', () => {
  fixtures.runFixtureTests([
  "conversion-1.sql",
  "conversion-2.sql",
  "conversion-3.sql",
  "conversion-4.sql",
  "conversion-5.sql",
  "conversion-6.sql",
  "conversion-7.sql",
  "conversion-8.sql",
  "conversion-9.sql",
  "conversion-10.sql",
  "conversion-11.sql",
  "conversion-12.sql",
  "conversion-13.sql"
]);
});
