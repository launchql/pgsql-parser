
import { FixtureTestUtils } from '../../test-utils';
const fixtures = new FixtureTestUtils();

it('namespace', () => {
  fixtures.runFixtureTests([
  "namespace-1.sql",
  "namespace-2.sql",
  "namespace-3.sql",
  "namespace-4.sql",
  "namespace-5.sql",
  "namespace-6.sql",
  "namespace-7.sql",
  "namespace-8.sql",
  "namespace-9.sql",
  "namespace-10.sql",
  "namespace-11.sql",
  "namespace-12.sql",
  "namespace-13.sql"
]);
});
