import * as e from '../src';

it('enums', () => {
  // - [ ] create a Union Type for the enums
  const exprKind: any = e.A_Expr_Kind.AEXPR_IN;

  switch(exprKind) {
    case e.A_Expr_Kind.AEXPR_IN:
    case e.A_Expr_Kind.AEXPR_BETWEEN:
    case e.A_Expr_Kind.AEXPR_BETWEEN_SYM:
    case e.A_Expr_Kind.AEXPR_DISTINCT:
    case e.A_Expr_Kind.AEXPR_ILIKE:
    case e.A_Expr_Kind.AEXPR_LIKE:
    case e.A_Expr_Kind.AEXPR_NOT_BETWEEN:
    case e.A_Expr_Kind.AEXPR_NOT_BETWEEN_SYM:
    case e.A_Expr_Kind.AEXPR_NOT_DISTINCT:
    case e.A_Expr_Kind.AEXPR_NULLIF:
    case e.A_Expr_Kind.AEXPR_OF:
    case e.A_Expr_Kind.AEXPR_OP:
    case e.A_Expr_Kind.AEXPR_OP_ALL:
    case e.A_Expr_Kind.AEXPR_OP_ANY:
    case e.A_Expr_Kind.AEXPR_PAREN:
    case e.A_Expr_Kind.AEXPR_SIMILAR:
      expect(exprKind).toBeDefined();
      break;
    default: 
      // This will fail the test if exprKind is not one of the expected enum values
      expect(true).toBe(false);
  }
});