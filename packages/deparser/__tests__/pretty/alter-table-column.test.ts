import { PrettyTest } from '../../test-utils/PrettyTest';
const prettyTest = new PrettyTest([
    "original/alter/alter-table-column-1.sql"
]);

prettyTest.generateTests();