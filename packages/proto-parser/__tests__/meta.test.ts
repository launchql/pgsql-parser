import wrapped from '../test-utils/meta/wrapped';
import { generateTsAstCodeFromPgAst } from '../src/utils'
import generate from '@babel/generator';

it('AST to AST to create AST — meta 🤯', () => {
    const selectStmt = wrapped.selectStmt({
        targetList: [
          wrapped.resTarget({
            val: wrapped.columnRef({
              fields: [wrapped.aStar()]
            })
          })
        ],
        fromClause: [
          wrapped.rangeVar({
            relname: 'some_amazing_table',
            inh: true,
            relpersistence: 'p'
          })
        ],
        limitOption: 'LIMIT_OPTION_DEFAULT',
        op: 'SETOP_NONE'
      });

      expect(selectStmt).toMatchSnapshot();
      
      const astForAst = generateTsAstCodeFromPgAst(selectStmt);
      expect(generate(astForAst).code).toMatchSnapshot();
      expect(generate(astForAst).code).toEqual(
`ast.selectStmt({
  targetList: [ast.resTarget({
    val: ast.columnRef({
      fields: [ast.aStar({})]
    })
  })],
  fromClause: [ast.rangeVar({
    relname: "some_amazing_table",
    inh: true,
    relpersistence: "p"
  })],
  limitOption: "LIMIT_OPTION_DEFAULT",
  op: "SETOP_NONE"
})`);

});