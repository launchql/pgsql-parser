import { getUndefinedKey } from "../src/utils";

it('getUndefinedKey', () => {
    expect(getUndefinedKey('SQLValueFunctionOp')).toEqual('SQLVALUE_FUNCTION_OP_UNDEFINED');
    expect(getUndefinedKey('AlterTSConfigType')).toEqual('ALTER_TSCONFIG_TYPE_UNDEFINED');
    expect(getUndefinedKey('A_Expr_Kind')).toEqual('A_EXPR_KIND_UNDEFINED');
  });
  