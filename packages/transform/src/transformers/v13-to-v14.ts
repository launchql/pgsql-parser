import * as PG13 from '../13/types';
import { TransformerContext } from './context';

/**
 * V13 to V14 AST Transformer
 * Transforms PostgreSQL v13 AST nodes to v14 format
 */
export class V13ToV14Transformer {
  
  transform(node: PG13.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  visit(node: PG13.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  getNodeType(node: PG13.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG13.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG13.ParseResult, context: TransformerContext): any {

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

  RawStmt(node: PG13.RawStmt, context: TransformerContext): any {
    return node;
  }

  SelectStmt(node: PG13.SelectStmt, context: TransformerContext): any {
    return node;
  }

  A_Expr(node: PG13.A_Expr, context: TransformerContext): any {
    return node;
  }

  InsertStmt(node: PG13.InsertStmt, context: TransformerContext): any {
    return node;
  }

  UpdateStmt(node: PG13.UpdateStmt, context: TransformerContext): any {
    return node;
  }

  DeleteStmt(node: PG13.DeleteStmt, context: TransformerContext): any {
    return node;
  }

  WithClause(node: PG13.WithClause, context: TransformerContext): any {
    return node;
  }

  ResTarget(node: PG13.ResTarget, context: TransformerContext): any {
    return node;
  }

  BoolExpr(node: PG13.BoolExpr, context: TransformerContext): any {
    return node;
  }

  FuncCall(node: PG13.FuncCall, context: TransformerContext): any {
    return node;
  }

  FuncExpr(node: PG13.FuncExpr, context: TransformerContext): any {
    return node;
  }

  A_Const(node: PG13.A_Const, context: TransformerContext): any {
    return node;
  }

  ColumnRef(node: PG13.ColumnRef, context: TransformerContext): any {
    return node;
  }

  TypeName(node: PG13.TypeName, context: TransformerContext): any {
    return node;
  }

  Alias(node: PG13.Alias, context: TransformerContext): any {
    return node;
  }

  RangeVar(node: PG13.RangeVar, context: TransformerContext): any {
    return node;
  }

  A_ArrayExpr(node: PG13.A_ArrayExpr, context: TransformerContext): any {
    return node;
  }

  A_Indices(node: PG13.A_Indices, context: TransformerContext): any {
    return node;
  }

  A_Indirection(node: PG13.A_Indirection, context: TransformerContext): any {
    return node;
  }

  A_Star(node: PG13.A_Star, context: TransformerContext): any {
    return node;
  }

  CaseExpr(node: PG13.CaseExpr, context: TransformerContext): any {
    return node;
  }

  CoalesceExpr(node: PG13.CoalesceExpr, context: TransformerContext): any {
    return node;
  }

  TypeCast(node: PG13.TypeCast, context: TransformerContext): any {
    return node;
  }

  CollateClause(node: PG13.CollateClause, context: TransformerContext): any {
    return node;
  }

  BooleanTest(node: PG13.BooleanTest, context: TransformerContext): any {
    return node;
  }

  NullTest(node: PG13.NullTest, context: TransformerContext): any {
    return node;
  }

  String(node: PG13.String, context: TransformerContext): any {
    return node;
  }
  
  Integer(node: PG13.Integer, context: TransformerContext): any {
    return node;
  }
  
  Float(node: PG13.Float, context: TransformerContext): any {
    return node;
  }
  
  Boolean(node: PG13.Boolean, context: TransformerContext): any {
    return node;
  }
  
  BitString(node: PG13.BitString, context: TransformerContext): any {
    return node;
  }
  
  Null(node: PG13.Node, context: TransformerContext): any {
    return node;
  }

  List(node: PG13.List, context: TransformerContext): any {
    return node;
  }

  CreateStmt(node: PG13.CreateStmt, context: TransformerContext): any {
    return node;
  }

  ColumnDef(node: PG13.ColumnDef, context: TransformerContext): any {
    return node;
  }

  Constraint(node: PG13.Constraint, context: TransformerContext): any {
    return node;
  }

  SubLink(node: PG13.SubLink, context: TransformerContext): any {
    return node;
  }

  CaseWhen(node: PG13.CaseWhen, context: TransformerContext): any {
    return node;
  }

  WindowDef(node: PG13.WindowDef, context: TransformerContext): any {
    return node;
  }

  SortBy(node: PG13.SortBy, context: TransformerContext): any {
    return node;
  }

  GroupingSet(node: PG13.GroupingSet, context: TransformerContext): any {
    return node;
  }

  CommonTableExpr(node: PG13.CommonTableExpr, context: TransformerContext): any {
    return node;
  }

  ParamRef(node: PG13.ParamRef, context: TransformerContext): any {
    return node;
  }

  LockingClause(node: any, context: TransformerContext): any {
    return node;
  }

  MinMaxExpr(node: PG13.MinMaxExpr, context: TransformerContext): any {
    return node;
  }

  RowExpr(node: PG13.RowExpr, context: TransformerContext): any {
    return node;
  }

  OpExpr(node: PG13.OpExpr, context: TransformerContext): any {
    return node;
  }

  DistinctExpr(node: PG13.DistinctExpr, context: TransformerContext): any {
    return node;
  }

  NullIfExpr(node: PG13.NullIfExpr, context: TransformerContext): any {
    return node;
  }

  ScalarArrayOpExpr(node: PG13.ScalarArrayOpExpr, context: TransformerContext): any {
    return node;
  }

  Aggref(node: PG13.Aggref, context: TransformerContext): any {
    return node;
  }

  WindowFunc(node: PG13.WindowFunc, context: TransformerContext): any {
    return node;
  }

  FieldSelect(node: PG13.FieldSelect, context: TransformerContext): any {
    return node;
  }

  RelabelType(node: PG13.RelabelType, context: TransformerContext): any {
    return node;
  }

  CoerceViaIO(node: PG13.CoerceViaIO, context: TransformerContext): any {
    return node;
  }

  ArrayCoerceExpr(node: PG13.ArrayCoerceExpr, context: TransformerContext): any {
    return node;
  }

  ConvertRowtypeExpr(node: PG13.ConvertRowtypeExpr, context: TransformerContext): any {
    return node;
  }

  NamedArgExpr(node: PG13.NamedArgExpr, context: TransformerContext): any {
    return node;
  }

  ViewStmt(node: PG13.ViewStmt, context: TransformerContext): any {
    return node;
  }

  IndexStmt(node: PG13.IndexStmt, context: TransformerContext): any {
    return node;
  }

  IndexElem(node: PG13.IndexElem, context: TransformerContext): any {
    return node;
  }

  PartitionElem(node: PG13.PartitionElem, context: TransformerContext): any {
    return node;
  }

  PartitionCmd(node: PG13.PartitionCmd, context: TransformerContext): any {
    return node;
  }

  JoinExpr(node: PG13.JoinExpr, context: TransformerContext): any {
    return node;
  }

  FromExpr(node: PG13.FromExpr, context: TransformerContext): any {
    return node;
  }

  TransactionStmt(node: PG13.TransactionStmt, context: TransformerContext): any {
    return node;
  }

  VariableSetStmt(node: PG13.VariableSetStmt, context: TransformerContext): any {
    return node;
  }

  VariableShowStmt(node: PG13.VariableShowStmt, context: TransformerContext): any {
    return node;
  }

  CreateSchemaStmt(node: PG13.CreateSchemaStmt, context: TransformerContext): any {
    return node;
  }

  RoleSpec(node: PG13.RoleSpec, context: TransformerContext): any {
    return node;
  }

  DropStmt(node: PG13.DropStmt, context: TransformerContext): any {
    return node;
  }

  TruncateStmt(node: PG13.TruncateStmt, context: TransformerContext): any {
    return node;
  }

  ReturnStmt(node: PG13.ReturnStmt, context: TransformerContext): any {
    return node;
  }

  PLAssignStmt(node: PG13.PLAssignStmt, context: TransformerContext): any {
    return node;
  }

  CopyStmt(node: PG13.CopyStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableStmt(node: PG13.AlterTableStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableCmd(node: PG13.AlterTableCmd, context: TransformerContext): any {
    return node;
  }

  CreateFunctionStmt(node: PG13.CreateFunctionStmt, context: TransformerContext): any {
    return node;
  }

  FunctionParameter(node: PG13.FunctionParameter, context: TransformerContext): any {
    return node;
  }

  CreateEnumStmt(node: PG13.CreateEnumStmt, context: TransformerContext): any {
    return node;
  }

  CreateDomainStmt(node: PG13.CreateDomainStmt, context: TransformerContext): any {
    return node;
  }

  CreateRoleStmt(node: PG13.CreateRoleStmt, context: TransformerContext): any {
    return node;
  }

  DefElem(node: PG13.DefElem, context: TransformerContext): any {
    return node;
  }

  CreateTableSpaceStmt(node: PG13.CreateTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  DropTableSpaceStmt(node: PG13.DropTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableSpaceOptionsStmt(node: PG13.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    return node;
  }

  CreateExtensionStmt(node: PG13.CreateExtensionStmt, context: TransformerContext): any {
    return node;
  }

  AlterExtensionStmt(node: PG13.AlterExtensionStmt, context: TransformerContext): any {
    return node;
  }

  CreateFdwStmt(node: PG13.CreateFdwStmt, context: TransformerContext): any {
    return node;
  }

  SetOperationStmt(node: PG13.SetOperationStmt, context: TransformerContext): any {
    return node;
  }

  ReplicaIdentityStmt(node: PG13.ReplicaIdentityStmt, context: TransformerContext): any {
    return node;
  }

  AlterCollationStmt(node: PG13.AlterCollationStmt, context: TransformerContext): any {
    return node;
  }

  AlterDomainStmt(node: PG13.AlterDomainStmt, context: TransformerContext): any {
    return node;
  }

  PrepareStmt(node: PG13.PrepareStmt, context: TransformerContext): any {
    return node;
  }

  ExecuteStmt(node: PG13.ExecuteStmt, context: TransformerContext): any {
    return node;
  }

  DeallocateStmt(node: PG13.DeallocateStmt, context: TransformerContext): any {
    return node;
  }

  NotifyStmt(node: PG13.NotifyStmt, context: TransformerContext): any {
    return node;
  }

  ListenStmt(node: PG13.ListenStmt, context: TransformerContext): any {
    return node;
  }

  UnlistenStmt(node: PG13.UnlistenStmt, context: TransformerContext): any {
    return node;
  }

  CheckPointStmt(node: PG13.CheckPointStmt, context: TransformerContext): any {
    return node;
  }

  LoadStmt(node: PG13.LoadStmt, context: TransformerContext): any {
    return node;
  }

  DiscardStmt(node: PG13.DiscardStmt, context: TransformerContext): any {
    return node;
  }

  CommentStmt(node: PG13.CommentStmt, context: TransformerContext): any {
    return node;
  }

  LockStmt(node: PG13.LockStmt, context: TransformerContext): any {
    return node;
  }

  CreatePolicyStmt(node: PG13.CreatePolicyStmt, context: TransformerContext): any {
    return node;
  }

  AlterPolicyStmt(node: PG13.AlterPolicyStmt, context: TransformerContext): any {
    return node;
  }

  CreateUserMappingStmt(node: PG13.CreateUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  CreateStatsStmt(node: PG13.CreateStatsStmt, context: TransformerContext): any {
    return node;
  }

  StatsElem(node: PG13.StatsElem, context: TransformerContext): any {
    return node;
  }

  CreatePublicationStmt(node: PG13.CreatePublicationStmt, context: TransformerContext): any {
    return node;
  }

  CreateSubscriptionStmt(node: PG13.CreateSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  AlterPublicationStmt(node: PG13.AlterPublicationStmt, context: TransformerContext): any {
    return node;
  }

  AlterSubscriptionStmt(node: PG13.AlterSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DropSubscriptionStmt(node: PG13.DropSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DoStmt(node: PG13.DoStmt, context: TransformerContext): any {
    return node;
  }

  InlineCodeBlock(node: PG13.InlineCodeBlock, context: TransformerContext): any {
    return node;
  }

  CallContext(node: PG13.CallContext, context: TransformerContext): any {
    return node;
  }

  ConstraintsSetStmt(node: PG13.ConstraintsSetStmt, context: TransformerContext): any {
    return node;
  }

  AlterSystemStmt(node: PG13.AlterSystemStmt, context: TransformerContext): any {
    return node;
  }

  VacuumRelation(node: PG13.VacuumRelation, context: TransformerContext): any {
    return node;
  }

  DropOwnedStmt(node: PG13.DropOwnedStmt, context: TransformerContext): any {
    return node;
  }

  ReassignOwnedStmt(node: PG13.ReassignOwnedStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSDictionaryStmt(node: PG13.AlterTSDictionaryStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSConfigurationStmt(node: PG13.AlterTSConfigurationStmt, context: TransformerContext): any {
    return node;
  }

  ClosePortalStmt(node: PG13.ClosePortalStmt, context: TransformerContext): any {
    return node;
  }

  FetchStmt(node: PG13.FetchStmt, context: TransformerContext): any {
    return node;
  }

  AlterStatsStmt(node: PG13.AlterStatsStmt, context: TransformerContext): any {
    return node;
  }

  ObjectWithArgs(node: PG13.ObjectWithArgs, context: TransformerContext): any {
    return node;
  }

  AlterOperatorStmt(node: PG13.AlterOperatorStmt, context: TransformerContext): any {
    return node;
  }

  AlterFdwStmt(node: PG13.AlterFdwStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignServerStmt(node: PG13.CreateForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterForeignServerStmt(node: PG13.AlterForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterUserMappingStmt(node: PG13.AlterUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  DropUserMappingStmt(node: PG13.DropUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  ImportForeignSchemaStmt(node: PG13.ImportForeignSchemaStmt, context: TransformerContext): any {
    return node;
  }

  ClusterStmt(node: PG13.ClusterStmt, context: TransformerContext): any {
    return node;
  }

  VacuumStmt(node: PG13.VacuumStmt, context: TransformerContext): any {
    return node;
  }

  ExplainStmt(node: PG13.ExplainStmt, context: TransformerContext): any {
    return node;
  }

  ReindexStmt(node: PG13.ReindexStmt, context: TransformerContext): any {
    return node;
  }

  CallStmt(node: PG13.CallStmt, context: TransformerContext): any {
    return node;
  }

  CreatedbStmt(node: PG13.CreatedbStmt, context: TransformerContext): any {
    return node;
  }

  DropdbStmt(node: PG13.DropdbStmt, context: TransformerContext): any {
    return node;
  }

  RenameStmt(node: PG13.RenameStmt, context: TransformerContext): any {
    return node;
  }

  AlterOwnerStmt(node: PG13.AlterOwnerStmt, context: TransformerContext): any {
    return node;
  }

  GrantStmt(node: PG13.GrantStmt, context: TransformerContext): any {
    return node;
  }

  GrantRoleStmt(node: PG13.GrantRoleStmt, context: TransformerContext): any {
    return node;
  }

  SecLabelStmt(node: PG13.SecLabelStmt, context: TransformerContext): any {
    return node;
  }

  AlterDefaultPrivilegesStmt(node: PG13.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    return node;
  }

  CreateConversionStmt(node: PG13.CreateConversionStmt, context: TransformerContext): any {
    return node;
  }

  CreateCastStmt(node: PG13.CreateCastStmt, context: TransformerContext): any {
    return node;
  }

  CreatePLangStmt(node: PG13.CreatePLangStmt, context: TransformerContext): any {
    return node;
  }

  CreateTransformStmt(node: PG13.CreateTransformStmt, context: TransformerContext): any {
    return node;
  }

  CreateTrigStmt(node: PG13.CreateTrigStmt, context: TransformerContext): any {
    return node;
  }

  TriggerTransition(node: PG13.TriggerTransition, context: TransformerContext): any {
    return node;
  }

  CreateEventTrigStmt(node: PG13.CreateEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  AlterEventTrigStmt(node: PG13.AlterEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpClassStmt(node: PG13.CreateOpClassStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpFamilyStmt(node: PG13.CreateOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  AlterOpFamilyStmt(node: PG13.AlterOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  MergeStmt(node: PG13.MergeStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableMoveAllStmt(node: PG13.AlterTableMoveAllStmt, context: TransformerContext): any {
    return node;
  }

  CreateSeqStmt(node: PG13.CreateSeqStmt, context: TransformerContext): any {
    return node;
  }

  AlterSeqStmt(node: PG13.AlterSeqStmt, context: TransformerContext): any {
    return node;
  }

  CompositeTypeStmt(node: PG13.CompositeTypeStmt, context: TransformerContext): any {
    return node;
  }

  CreateRangeStmt(node: PG13.CreateRangeStmt, context: TransformerContext): any {
    return node;
  }

  AlterEnumStmt(node: PG13.AlterEnumStmt, context: TransformerContext): any {
    return node;
  }

  AlterTypeStmt(node: PG13.AlterTypeStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleStmt(node: PG13.AlterRoleStmt, context: TransformerContext): any {
    return node;
  }

  DropRoleStmt(node: PG13.DropRoleStmt, context: TransformerContext): any {
    return node;
  }

  CreateAggregateStmt(node: PG13.DefineStmt, context: TransformerContext): any {
    return node;
  }

  CreateTableAsStmt(node: PG13.CreateTableAsStmt, context: TransformerContext): any {
    return node;
  }

  RefreshMatViewStmt(node: PG13.RefreshMatViewStmt, context: TransformerContext): any {
    return node;
  }

  AccessPriv(node: PG13.AccessPriv, context: TransformerContext): any {
    return node;
  }

  DefineStmt(node: PG13.DefineStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseStmt(node: PG13.AlterDatabaseStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseRefreshCollStmt(node: PG13.AlterDatabaseRefreshCollStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseSetStmt(node: PG13.AlterDatabaseSetStmt, context: TransformerContext): any {
    return node;
  }

  DeclareCursorStmt(node: PG13.DeclareCursorStmt, context: TransformerContext): any {
    return node;
  }

  PublicationObjSpec(node: PG13.PublicationObjSpec, context: TransformerContext): any {
    return node;
  }

  PublicationTable(node: PG13.PublicationTable, context: TransformerContext): any {
    return node;
  }

  CreateAmStmt(node: PG13.CreateAmStmt, context: TransformerContext): any {
    return node;
  }

  IntoClause(node: PG13.IntoClause, context: TransformerContext): any {
    return node;
  }

  OnConflictExpr(node: PG13.OnConflictExpr, context: TransformerContext): any {
    return node;
  }

  ScanToken(node: PG13.ScanToken, context: TransformerContext): any {
    return node;
  }

  CreateOpClassItem(node: PG13.CreateOpClassItem, context: TransformerContext): any {
    return node;
  }

  Var(node: PG13.Var, context: TransformerContext): any {
    return node;
  }

  TableFunc(node: PG13.TableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFunc(node: PG13.RangeTableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFuncCol(node: PG13.RangeTableFuncCol, context: TransformerContext): any {
    return node;
  }

  JsonArrayQueryConstructor(node: PG13.JsonArrayQueryConstructor, context: TransformerContext): any {
    return node;
  }

  RangeFunction(node: PG13.RangeFunction, context: TransformerContext): any {
    return node;
  }

  XmlExpr(node: PG13.XmlExpr, context: TransformerContext): any {
    return node;
  }

  RangeTableSample(node: PG13.RangeTableSample, context: TransformerContext): any {
    return node;
  }

  XmlSerialize(node: PG13.XmlSerialize, context: TransformerContext): any {
    return node;
  }

  RuleStmt(node: PG13.RuleStmt, context: TransformerContext): any {
    return node;
  }

  RangeSubselect(node: PG13.RangeSubselect, context: TransformerContext): any {
    return node;
  }

  SQLValueFunction(node: PG13.SQLValueFunction, context: TransformerContext): any {
    return node;
  }

  GroupingFunc(node: PG13.GroupingFunc, context: TransformerContext): any {
    return node;
  }

  MultiAssignRef(node: PG13.MultiAssignRef, context: TransformerContext): any {
    return node;
  }

  SetToDefault(node: PG13.SetToDefault, context: TransformerContext): any {
    return node;
  }

  CurrentOfExpr(node: PG13.CurrentOfExpr, context: TransformerContext): any {
    return node;
  }

  TableLikeClause(node: PG13.TableLikeClause, context: TransformerContext): any {
    return node;
  }

  AlterFunctionStmt(node: PG13.AlterFunctionStmt, context: TransformerContext): any {
    return node;
  }

  AlterObjectSchemaStmt(node: PG13.AlterObjectSchemaStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleSetStmt(node: PG13.AlterRoleSetStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignTableStmt(node: PG13.CreateForeignTableStmt, context: TransformerContext): any {
    return node;
  }
}
