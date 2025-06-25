import * as PG14 from '../14/types';
import { TransformerContext } from './context';

/**
 * V14 to V15 AST Transformer
 * Transforms PostgreSQL v14 AST nodes to v15 format
 */
export class V14ToV15Transformer {
  
  transform(node: PG14.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    if (node == null) {
      return null;
    }

    if (typeof node === 'number' || node instanceof Number) {
      return node;
    }

    if (typeof node === 'string') {
      return node;
    }

    try {
      return this.visit(node, context);
    } catch (error) {
      const nodeType = Object.keys(node)[0];
      throw new Error(`Error transforming ${nodeType}: ${(error as Error).message}`);
    }
  }

  visit(node: PG14.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    const nodeType = this.getNodeType(node);
    
    // Handle empty objects
    if (!nodeType) {
      return {};
    }
    
    const nodeData = this.getNodeData(node);

    const methodName = nodeType as keyof this;
    if (typeof this[methodName] === 'function') {
      const childContext: TransformerContext = {
        ...context,
        parentNodeTypes: [...context.parentNodeTypes, nodeType]
      };
      const result = (this[methodName] as any)(nodeData, childContext);
      
      return result;
    }
    
    // If no specific method, return the node as-is
    return node;
  }

  getNodeType(node: PG14.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG14.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG14.ParseResult, context: TransformerContext): any {
    
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 140000, // PG14 version
        stmts: node.stmts.map((stmt: any) => {
          if (stmt && typeof stmt === 'object' && 'stmt' in stmt) {
            return {
              ...stmt,
              stmt: this.transform(stmt.stmt, context)
            };
          }
          return this.transform(stmt, context);
        })
      };
    }

    return node;
  }

  RawStmt(node: PG14.RawStmt, context: TransformerContext): any {
    return node;
  }

  SelectStmt(node: PG14.SelectStmt, context: TransformerContext): any {
    return node;
  }

  A_Expr(node: PG14.A_Expr, context: TransformerContext): any {
    return node;
  }

  InsertStmt(node: PG14.InsertStmt, context: TransformerContext): any {
    return node;
  }

  UpdateStmt(node: PG14.UpdateStmt, context: TransformerContext): any {
    return node;
  }

  DeleteStmt(node: PG14.DeleteStmt, context: TransformerContext): any {
    return node;
  }

  WithClause(node: PG14.WithClause, context: TransformerContext): any {
    return node;
  }

  ResTarget(node: PG14.ResTarget, context: TransformerContext): any {
    return node;
  }

  BoolExpr(node: PG14.BoolExpr, context: TransformerContext): any {
    return node;
  }

  FuncCall(node: PG14.FuncCall, context: TransformerContext): any {
    return node;
  }

  FuncExpr(node: PG14.FuncExpr, context: TransformerContext): any {
    return node;
  }

  A_Const(node: PG14.A_Const, context: TransformerContext): any {
    return node;
  }

  ColumnRef(node: PG14.ColumnRef, context: TransformerContext): any {
    return node;
  }

  TypeName(node: PG14.TypeName, context: TransformerContext): any {
    return node;
  }

  Alias(node: PG14.Alias, context: TransformerContext): any {
    return node;
  }

  RangeVar(node: PG14.RangeVar, context: TransformerContext): any {
    return node;
  }

  A_ArrayExpr(node: PG14.A_ArrayExpr, context: TransformerContext): any {
    return node;
  }

  A_Indices(node: PG14.A_Indices, context: TransformerContext): any {
    return node;
  }

  A_Indirection(node: PG14.A_Indirection, context: TransformerContext): any {
    return node;
  }

  A_Star(node: PG14.A_Star, context: TransformerContext): any {
    return node;
  }

  CaseExpr(node: PG14.CaseExpr, context: TransformerContext): any {
    return node;
  }

  CoalesceExpr(node: PG14.CoalesceExpr, context: TransformerContext): any {
    return node;
  }

  TypeCast(node: PG14.TypeCast, context: TransformerContext): any {
    return node;
  }

  CollateClause(node: PG14.CollateClause, context: TransformerContext): any {
    return node;
  }

  BooleanTest(node: PG14.BooleanTest, context: TransformerContext): any {
    return node;
  }

  NullTest(node: PG14.NullTest, context: TransformerContext): any {
    return node;
  }

  String(node: PG14.String, context: TransformerContext): any {
    return node;
  }
  
  Integer(node: PG14.Integer, context: TransformerContext): any {
    return node;
  }
  
  Float(node: PG14.Float, context: TransformerContext): any {
    return node;
  }
    
  BitString(node: PG14.BitString, context: TransformerContext): any {
    return node;
  }
  
  Null(node: PG14.Node, context: TransformerContext): any {
    return node;
  }

  List(node: PG14.List, context: TransformerContext): any {
    return node;
  }

  CreateStmt(node: PG14.CreateStmt, context: TransformerContext): any {
    return node;
  }

  ColumnDef(node: PG14.ColumnDef, context: TransformerContext): any {
    return node;
  }

  Constraint(node: PG14.Constraint, context: TransformerContext): any {
    return node;
  }

  SubLink(node: PG14.SubLink, context: TransformerContext): any {
    return node;
  }

  CaseWhen(node: PG14.CaseWhen, context: TransformerContext): any {
    return node;
  }

  WindowDef(node: PG14.WindowDef, context: TransformerContext): any {
    return node;
  }

  SortBy(node: PG14.SortBy, context: TransformerContext): any {
    return node;
  }

  GroupingSet(node: PG14.GroupingSet, context: TransformerContext): any {
    return node;
  }

  CommonTableExpr(node: PG14.CommonTableExpr, context: TransformerContext): any {
    return node;
  }

  ParamRef(node: PG14.ParamRef, context: TransformerContext): any {
    return node;
  }

  LockingClause(node: any, context: TransformerContext): any {
    return node;
  }

  MinMaxExpr(node: PG14.MinMaxExpr, context: TransformerContext): any {
    return node;
  }

  RowExpr(node: PG14.RowExpr, context: TransformerContext): any {
    return node;
  }

  OpExpr(node: PG14.OpExpr, context: TransformerContext): any {
    return node;
  }

  DistinctExpr(node: PG14.DistinctExpr, context: TransformerContext): any {
    return node;
  }

  NullIfExpr(node: PG14.NullIfExpr, context: TransformerContext): any {
    return node;
  }

  ScalarArrayOpExpr(node: PG14.ScalarArrayOpExpr, context: TransformerContext): any {
    return node;
  }

  Aggref(node: PG14.Aggref, context: TransformerContext): any {
    return node;
  }

  WindowFunc(node: PG14.WindowFunc, context: TransformerContext): any {
    return node;
  }

  FieldSelect(node: PG14.FieldSelect, context: TransformerContext): any {
    return node;
  }

  RelabelType(node: PG14.RelabelType, context: TransformerContext): any {
    return node;
  }

  CoerceViaIO(node: PG14.CoerceViaIO, context: TransformerContext): any {
    return node;
  }

  ArrayCoerceExpr(node: PG14.ArrayCoerceExpr, context: TransformerContext): any {
    return node;
  }

  ConvertRowtypeExpr(node: PG14.ConvertRowtypeExpr, context: TransformerContext): any {
    return node;
  }

  NamedArgExpr(node: PG14.NamedArgExpr, context: TransformerContext): any {
    return node;
  }

  ViewStmt(node: PG14.ViewStmt, context: TransformerContext): any {
    return node;
  }

  IndexStmt(node: PG14.IndexStmt, context: TransformerContext): any {
    return node;
  }

  IndexElem(node: PG14.IndexElem, context: TransformerContext): any {
    return node;
  }

  PartitionElem(node: PG14.PartitionElem, context: TransformerContext): any {
    return node;
  }

  PartitionCmd(node: PG14.PartitionCmd, context: TransformerContext): any {
    return node;
  }

  JoinExpr(node: PG14.JoinExpr, context: TransformerContext): any {
    return node;
  }

  FromExpr(node: PG14.FromExpr, context: TransformerContext): any {
    return node;
  }

  TransactionStmt(node: PG14.TransactionStmt, context: TransformerContext): any {
    return node;
  }

  VariableSetStmt(node: PG14.VariableSetStmt, context: TransformerContext): any {
    return node;
  }

  VariableShowStmt(node: PG14.VariableShowStmt, context: TransformerContext): any {
    return node;
  }

  CreateSchemaStmt(node: PG14.CreateSchemaStmt, context: TransformerContext): any {
    return node;
  }

  RoleSpec(node: PG14.RoleSpec, context: TransformerContext): any {
    return node;
  }

  DropStmt(node: PG14.DropStmt, context: TransformerContext): any {
    return node;
  }

  TruncateStmt(node: PG14.TruncateStmt, context: TransformerContext): any {
    return node;
  }

  ReturnStmt(node: PG14.ReturnStmt, context: TransformerContext): any {
    return node;
  }

  PLAssignStmt(node: PG14.PLAssignStmt, context: TransformerContext): any {
    return node;
  }

  CopyStmt(node: PG14.CopyStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableStmt(node: PG14.AlterTableStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableCmd(node: PG14.AlterTableCmd, context: TransformerContext): any {
    return node;
  }

  CreateFunctionStmt(node: PG14.CreateFunctionStmt, context: TransformerContext): any {
    return node;
  }

  FunctionParameter(node: PG14.FunctionParameter, context: TransformerContext): any {
    return node;
  }

  CreateEnumStmt(node: PG14.CreateEnumStmt, context: TransformerContext): any {
    return node;
  }

  CreateDomainStmt(node: PG14.CreateDomainStmt, context: TransformerContext): any {
    return node;
  }

  CreateRoleStmt(node: PG14.CreateRoleStmt, context: TransformerContext): any {
    return node;
  }

  DefElem(node: PG14.DefElem, context: TransformerContext): any {
    return node;
  }

  CreateTableSpaceStmt(node: PG14.CreateTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  DropTableSpaceStmt(node: PG14.DropTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableSpaceOptionsStmt(node: PG14.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    return node;
  }

  CreateExtensionStmt(node: PG14.CreateExtensionStmt, context: TransformerContext): any {
    return node;
  }

  AlterExtensionStmt(node: PG14.AlterExtensionStmt, context: TransformerContext): any {
    return node;
  }

  CreateFdwStmt(node: PG14.CreateFdwStmt, context: TransformerContext): any {
    return node;
  }

  SetOperationStmt(node: PG14.SetOperationStmt, context: TransformerContext): any {
    return node;
  }

  ReplicaIdentityStmt(node: PG14.ReplicaIdentityStmt, context: TransformerContext): any {
    return node;
  }

  AlterCollationStmt(node: PG14.AlterCollationStmt, context: TransformerContext): any {
    return node;
  }

  AlterDomainStmt(node: PG14.AlterDomainStmt, context: TransformerContext): any {
    return node;
  }

  PrepareStmt(node: PG14.PrepareStmt, context: TransformerContext): any {
    return node;
  }

  ExecuteStmt(node: PG14.ExecuteStmt, context: TransformerContext): any {
    return node;
  }

  DeallocateStmt(node: PG14.DeallocateStmt, context: TransformerContext): any {
    return node;
  }

  NotifyStmt(node: PG14.NotifyStmt, context: TransformerContext): any {
    return node;
  }

  ListenStmt(node: PG14.ListenStmt, context: TransformerContext): any {
    return node;
  }

  UnlistenStmt(node: PG14.UnlistenStmt, context: TransformerContext): any {
    return node;
  }

  CheckPointStmt(node: PG14.CheckPointStmt, context: TransformerContext): any {
    return node;
  }

  LoadStmt(node: PG14.LoadStmt, context: TransformerContext): any {
    return node;
  }

  DiscardStmt(node: PG14.DiscardStmt, context: TransformerContext): any {
    return node;
  }

  CommentStmt(node: PG14.CommentStmt, context: TransformerContext): any {
    return node;
  }

  LockStmt(node: PG14.LockStmt, context: TransformerContext): any {
    return node;
  }

  CreatePolicyStmt(node: PG14.CreatePolicyStmt, context: TransformerContext): any {
    return node;
  }

  AlterPolicyStmt(node: PG14.AlterPolicyStmt, context: TransformerContext): any {
    return node;
  }

  CreateUserMappingStmt(node: PG14.CreateUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  CreateStatsStmt(node: PG14.CreateStatsStmt, context: TransformerContext): any {
    return node;
  }

  StatsElem(node: PG14.StatsElem, context: TransformerContext): any {
    return node;
  }

  CreatePublicationStmt(node: PG14.CreatePublicationStmt, context: TransformerContext): any {
    return node;
  }

  CreateSubscriptionStmt(node: PG14.CreateSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  AlterPublicationStmt(node: PG14.AlterPublicationStmt, context: TransformerContext): any {
    return node;
  }

  AlterSubscriptionStmt(node: PG14.AlterSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DropSubscriptionStmt(node: PG14.DropSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DoStmt(node: PG14.DoStmt, context: TransformerContext): any {
    return node;
  }

  InlineCodeBlock(node: PG14.InlineCodeBlock, context: TransformerContext): any {
    return node;
  }

  CallContext(node: PG14.CallContext, context: TransformerContext): any {
    return node;
  }

  ConstraintsSetStmt(node: PG14.ConstraintsSetStmt, context: TransformerContext): any {
    return node;
  }

  AlterSystemStmt(node: PG14.AlterSystemStmt, context: TransformerContext): any {
    return node;
  }

  VacuumRelation(node: PG14.VacuumRelation, context: TransformerContext): any {
    return node;
  }

  DropOwnedStmt(node: PG14.DropOwnedStmt, context: TransformerContext): any {
    return node;
  }

  ReassignOwnedStmt(node: PG14.ReassignOwnedStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSDictionaryStmt(node: PG14.AlterTSDictionaryStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSConfigurationStmt(node: PG14.AlterTSConfigurationStmt, context: TransformerContext): any {
    return node;
  }

  ClosePortalStmt(node: PG14.ClosePortalStmt, context: TransformerContext): any {
    return node;
  }

  FetchStmt(node: PG14.FetchStmt, context: TransformerContext): any {
    return node;
  }

  AlterStatsStmt(node: PG14.AlterStatsStmt, context: TransformerContext): any {
    return node;
  }

  ObjectWithArgs(node: PG14.ObjectWithArgs, context: TransformerContext): any {
    return node;
  }

  AlterOperatorStmt(node: PG14.AlterOperatorStmt, context: TransformerContext): any {
    return node;
  }

  AlterFdwStmt(node: PG14.AlterFdwStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignServerStmt(node: PG14.CreateForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterForeignServerStmt(node: PG14.AlterForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterUserMappingStmt(node: PG14.AlterUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  DropUserMappingStmt(node: PG14.DropUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  ImportForeignSchemaStmt(node: PG14.ImportForeignSchemaStmt, context: TransformerContext): any {
    return node;
  }

  ClusterStmt(node: PG14.ClusterStmt, context: TransformerContext): any {
    return node;
  }

  VacuumStmt(node: PG14.VacuumStmt, context: TransformerContext): any {
    return node;
  }

  ExplainStmt(node: PG14.ExplainStmt, context: TransformerContext): any {
    return node;
  }

  ReindexStmt(node: PG14.ReindexStmt, context: TransformerContext): any {
    return node;
  }

  CallStmt(node: PG14.CallStmt, context: TransformerContext): any {
    return node;
  }

  CreatedbStmt(node: PG14.CreatedbStmt, context: TransformerContext): any {
    return node;
  }

  DropdbStmt(node: PG14.DropdbStmt, context: TransformerContext): any {
    return node;
  }

  RenameStmt(node: PG14.RenameStmt, context: TransformerContext): any {
    return node;
  }

  AlterOwnerStmt(node: PG14.AlterOwnerStmt, context: TransformerContext): any {
    return node;
  }

  GrantStmt(node: PG14.GrantStmt, context: TransformerContext): any {
    return node;
  }

  GrantRoleStmt(node: PG14.GrantRoleStmt, context: TransformerContext): any {
    return node;
  }

  SecLabelStmt(node: PG14.SecLabelStmt, context: TransformerContext): any {
    return node;
  }

  AlterDefaultPrivilegesStmt(node: PG14.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    return node;
  }

  CreateConversionStmt(node: PG14.CreateConversionStmt, context: TransformerContext): any {
    return node;
  }

  CreateCastStmt(node: PG14.CreateCastStmt, context: TransformerContext): any {
    return node;
  }

  CreatePLangStmt(node: PG14.CreatePLangStmt, context: TransformerContext): any {
    return node;
  }

  CreateTransformStmt(node: PG14.CreateTransformStmt, context: TransformerContext): any {
    return node;
  }

  CreateTrigStmt(node: PG14.CreateTrigStmt, context: TransformerContext): any {
    return node;
  }

  TriggerTransition(node: PG14.TriggerTransition, context: TransformerContext): any {
    return node;
  }

  CreateEventTrigStmt(node: PG14.CreateEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  AlterEventTrigStmt(node: PG14.AlterEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpClassStmt(node: PG14.CreateOpClassStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpFamilyStmt(node: PG14.CreateOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  AlterOpFamilyStmt(node: PG14.AlterOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableMoveAllStmt(node: PG14.AlterTableMoveAllStmt, context: TransformerContext): any {
    return node;
  }

  CreateSeqStmt(node: PG14.CreateSeqStmt, context: TransformerContext): any {
    return node;
  }

  AlterSeqStmt(node: PG14.AlterSeqStmt, context: TransformerContext): any {
    return node;
  }

  CompositeTypeStmt(node: PG14.CompositeTypeStmt, context: TransformerContext): any {
    return node;
  }

  CreateRangeStmt(node: PG14.CreateRangeStmt, context: TransformerContext): any {
    return node;
  }

  AlterEnumStmt(node: PG14.AlterEnumStmt, context: TransformerContext): any {
    return node;
  }

  AlterTypeStmt(node: PG14.AlterTypeStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleStmt(node: PG14.AlterRoleStmt, context: TransformerContext): any {
    return node;
  }

  DropRoleStmt(node: PG14.DropRoleStmt, context: TransformerContext): any {
    return node;
  }

  CreateAggregateStmt(node: PG14.DefineStmt, context: TransformerContext): any {
    return node;
  }

  CreateTableAsStmt(node: PG14.CreateTableAsStmt, context: TransformerContext): any {
    return node;
  }

  RefreshMatViewStmt(node: PG14.RefreshMatViewStmt, context: TransformerContext): any {
    return node;
  }

  AccessPriv(node: PG14.AccessPriv, context: TransformerContext): any {
    return node;
  }

  DefineStmt(node: PG14.DefineStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseStmt(node: PG14.AlterDatabaseStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseSetStmt(node: PG14.AlterDatabaseSetStmt, context: TransformerContext): any {
    return node;
  }

  DeclareCursorStmt(node: PG14.DeclareCursorStmt, context: TransformerContext): any {
    return node;
  }

  CreateAmStmt(node: PG14.CreateAmStmt, context: TransformerContext): any {
    return node;
  }

  IntoClause(node: PG14.IntoClause, context: TransformerContext): any {
    return node;
  }

  OnConflictExpr(node: PG14.OnConflictExpr, context: TransformerContext): any {
    return node;
  }

  ScanToken(node: PG14.ScanToken, context: TransformerContext): any {
    return node;
  }

  CreateOpClassItem(node: PG14.CreateOpClassItem, context: TransformerContext): any {
    return node;
  }

  Var(node: PG14.Var, context: TransformerContext): any {
    return node;
  }

  TableFunc(node: PG14.TableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFunc(node: PG14.RangeTableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFuncCol(node: PG14.RangeTableFuncCol, context: TransformerContext): any {
    return node;
  }

  RangeFunction(node: PG14.RangeFunction, context: TransformerContext): any {
    return node;
  }

  XmlExpr(node: PG14.XmlExpr, context: TransformerContext): any {
    return node;
  }

  RangeTableSample(node: PG14.RangeTableSample, context: TransformerContext): any {
    return node;
  }

  XmlSerialize(node: PG14.XmlSerialize, context: TransformerContext): any {
    return node;
  }

  RuleStmt(node: PG14.RuleStmt, context: TransformerContext): any {
    return node;
  }

  RangeSubselect(node: PG14.RangeSubselect, context: TransformerContext): any {
    return node;
  }

  SQLValueFunction(node: PG14.SQLValueFunction, context: TransformerContext): any {
    return node;
  }

  GroupingFunc(node: PG14.GroupingFunc, context: TransformerContext): any {
    return node;
  }

  MultiAssignRef(node: PG14.MultiAssignRef, context: TransformerContext): any {
    return node;
  }

  SetToDefault(node: PG14.SetToDefault, context: TransformerContext): any {
    return node;
  }

  CurrentOfExpr(node: PG14.CurrentOfExpr, context: TransformerContext): any {
    return node;
  }

  TableLikeClause(node: PG14.TableLikeClause, context: TransformerContext): any {
    return node;
  }

  AlterFunctionStmt(node: PG14.AlterFunctionStmt, context: TransformerContext): any {
    return node;
  }

  AlterObjectSchemaStmt(node: PG14.AlterObjectSchemaStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleSetStmt(node: PG14.AlterRoleSetStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignTableStmt(node: PG14.CreateForeignTableStmt, context: TransformerContext): any {
    return node;
  }
}
