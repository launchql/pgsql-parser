
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('circle', () => {
  fixtures.runFixtureTests([
  "circle-1.sql",
  "circle-2.sql",
  "circle-3.sql",
  "circle-4.sql",
  "circle-5.sql",
  "circle-6.sql",
  "circle-7.sql",
  "circle-8.sql",
  "circle-9.sql",
  "circle-10.sql",
  "circle-11.sql",
  "circle-12.sql",
  "circle-13.sql",
  "circle-14.sql",
  "circle-15.sql",
  "circle-16.sql",
  "circle-17.sql"
]);
});
