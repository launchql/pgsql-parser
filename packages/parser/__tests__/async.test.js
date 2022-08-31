import { parseAsync } from '../src';
import { cleanTree } from '../src/utils';

const testQuery = `
  SELECT *
  FROM restaurants
  WHERE health_grade = 'A'
    AND average_rating >= 4.5;
`;

it('works', async () => {
  const results = await parseAsync(testQuery);
  expect(cleanTree(results)).toMatchSnapshot();
});
