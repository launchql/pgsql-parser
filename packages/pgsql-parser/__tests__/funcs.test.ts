import { parseFunction } from '../src';
import { cleanTree } from '../src/utils';

const testFunction = `
CREATE FUNCTION ast.index_elem (
  v_name text DEFAULT NULL,
  v_ordering int DEFAULT NULL,
  v_nulls_ordering int DEFAULT NULL,
  v_expr jsonb DEFAULT NULL,
  v_opclass jsonb DEFAULT NULL,
  v_collation jsonb DEFAULT NULL
) RETURNS jsonb AS $EOFCODE$
DECLARE
  result jsonb = '{"IndexElem":{}}'::jsonb;
BEGIN
  result = ast.jsonb_set(result, '{IndexElem, name}', to_jsonb(v_name));
  result = ast.jsonb_set(result, '{IndexElem, ordering}', to_jsonb(v_ordering));
  result = ast.jsonb_set(result, '{IndexElem, nulls_ordering}', to_jsonb(v_nulls_ordering));
  result = ast.jsonb_set(result, '{IndexElem, expr}', v_expr);
  result = ast.jsonb_set(result, '{IndexElem, opclass}', v_opclass);
  result = ast.jsonb_set(result, '{IndexElem, collation}', v_collation);
  RETURN result;
END;
$EOFCODE$ LANGUAGE plpgsql IMMUTABLE;
     `;

it('works', async () => {
  const results = parseFunction(testFunction);
  expect(cleanTree(results)).toMatchSnapshot();
});
