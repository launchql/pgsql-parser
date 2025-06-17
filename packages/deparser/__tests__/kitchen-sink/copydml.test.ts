
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('copydml', () => {
  fixtures.runFixtureTests([
  "copydml-1.sql",
  "copydml-2.sql",
  "copydml-3.sql",
  "copydml-4.sql",
  "copydml-5.sql",
  "copydml-6.sql",
  "copydml-7.sql",
  "copydml-8.sql",
  "copydml-9.sql",
  "copydml-10.sql",
  "copydml-11.sql",
  "copydml-12.sql",
  "copydml-13.sql",
  "copydml-14.sql"
]);
});
