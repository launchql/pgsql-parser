import * as PG15 from '../15/types';
import { TransformerContext } from './context';

/**
 * V15 to V16 AST Transformer
 * Transforms PostgreSQL v15 AST nodes to v16 format
 */
export class V15ToV16Transformer {
  
  transform(node: PG15.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  visit(node: PG15.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  getNodeType(node: PG15.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG15.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG15.ParseResult, context: TransformerContext): any {
    
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 150000, // PG15 version
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

  RawStmt(node: PG15.RawStmt, context: TransformerContext): any {
    return node;
  }

  SelectStmt(node: PG15.SelectStmt, context: TransformerContext): any {
    return node;
  }

  A_Expr(node: PG15.A_Expr, context: TransformerContext): any {
    return node;
  }

  InsertStmt(node: PG15.InsertStmt, context: TransformerContext): any {
    return node;
  }

  UpdateStmt(node: PG15.UpdateStmt, context: TransformerContext): any {
    return node;
  }

  DeleteStmt(node: PG15.DeleteStmt, context: TransformerContext): any {
    return node;
  }

  WithClause(node: PG15.WithClause, context: TransformerContext): any {
    return node;
  }

  ResTarget(node: PG15.ResTarget, context: TransformerContext): any {
    return node;
  }

  BoolExpr(node: PG15.BoolExpr, context: TransformerContext): any {
    return node;
  }

  FuncCall(node: PG15.FuncCall, context: TransformerContext): any {
    return node;
  }

  FuncExpr(node: PG15.FuncExpr, context: TransformerContext): any {
    return node;
  }

  A_Const(node: PG15.A_Const, context: TransformerContext): any {
    return node;
  }

  ColumnRef(node: PG15.ColumnRef, context: TransformerContext): any {
    return node;
  }

  TypeName(node: PG15.TypeName, context: TransformerContext): any {
    return node;
  }

  Alias(node: PG15.Alias, context: TransformerContext): any {
    return node;
  }

  RangeVar(node: PG15.RangeVar, context: TransformerContext): any {
    return node;
  }

  A_ArrayExpr(node: PG15.A_ArrayExpr, context: TransformerContext): any {
    return node;
  }

  A_Indices(node: PG15.A_Indices, context: TransformerContext): any {
    return node;
  }

  A_Indirection(node: PG15.A_Indirection, context: TransformerContext): any {
    return node;
  }

  A_Star(node: PG15.A_Star, context: TransformerContext): any {
    return node;
  }

  CaseExpr(node: PG15.CaseExpr, context: TransformerContext): any {
    return node;
  }

  CoalesceExpr(node: PG15.CoalesceExpr, context: TransformerContext): any {
    return node;
  }

  TypeCast(node: PG15.TypeCast, context: TransformerContext): any {
    return node;
  }

  CollateClause(node: PG15.CollateClause, context: TransformerContext): any {
    return node;
  }

  BooleanTest(node: PG15.BooleanTest, context: TransformerContext): any {
    return node;
  }

  NullTest(node: PG15.NullTest, context: TransformerContext): any {
    return node;
  }

  String(node: PG15.String, context: TransformerContext): any {
    return node;
  }
  
  Integer(node: PG15.Integer, context: TransformerContext): any {
    return node;
  }
  
  Float(node: PG15.Float, context: TransformerContext): any {
    return node;
  }
  
  Boolean(node: PG15.Boolean, context: TransformerContext): any {
    return node;
  }
  
  BitString(node: PG15.BitString, context: TransformerContext): any {
    return node;
  }
  
  Null(node: PG15.Node, context: TransformerContext): any {
    return node;
  }

  List(node: PG15.List, context: TransformerContext): any {
    return node;
  }

  CreateStmt(node: PG15.CreateStmt, context: TransformerContext): any {
    return node;
  }

  ColumnDef(node: PG15.ColumnDef, context: TransformerContext): any {
    return node;
  }

  Constraint(node: PG15.Constraint, context: TransformerContext): any {
    return node;
  }

  SubLink(node: PG15.SubLink, context: TransformerContext): any {
    return node;
  }

  CaseWhen(node: PG15.CaseWhen, context: TransformerContext): any {
    return node;
  }

  WindowDef(node: PG15.WindowDef, context: TransformerContext): any {
    return node;
  }

  SortBy(node: PG15.SortBy, context: TransformerContext): any {
    return node;
  }

  GroupingSet(node: PG15.GroupingSet, context: TransformerContext): any {
    return node;
  }

  CommonTableExpr(node: PG15.CommonTableExpr, context: TransformerContext): any {
    return node;
  }

  ParamRef(node: PG15.ParamRef, context: TransformerContext): any {
    return node;
  }

  LockingClause(node: any, context: TransformerContext): any {
    return node;
  }

  MinMaxExpr(node: PG15.MinMaxExpr, context: TransformerContext): any {
    return node;
  }

  RowExpr(node: PG15.RowExpr, context: TransformerContext): any {
    return node;
  }

  OpExpr(node: PG15.OpExpr, context: TransformerContext): any {
    return node;
  }

  DistinctExpr(node: PG15.DistinctExpr, context: TransformerContext): any {
    return node;
  }

  NullIfExpr(node: PG15.NullIfExpr, context: TransformerContext): any {
    return node;
  }

  ScalarArrayOpExpr(node: PG15.ScalarArrayOpExpr, context: TransformerContext): any {
    return node;
  }

  Aggref(node: PG15.Aggref, context: TransformerContext): any {
    return node;
  }

  WindowFunc(node: PG15.WindowFunc, context: TransformerContext): any {
    return node;
  }

  FieldSelect(node: PG15.FieldSelect, context: TransformerContext): any {
    return node;
  }

  RelabelType(node: PG15.RelabelType, context: TransformerContext): any {
    return node;
  }

  CoerceViaIO(node: PG15.CoerceViaIO, context: TransformerContext): any {
    return node;
  }

  ArrayCoerceExpr(node: PG15.ArrayCoerceExpr, context: TransformerContext): any {
    return node;
  }

  ConvertRowtypeExpr(node: PG15.ConvertRowtypeExpr, context: TransformerContext): any {
    return node;
  }

  NamedArgExpr(node: PG15.NamedArgExpr, context: TransformerContext): any {
    return node;
  }

  ViewStmt(node: PG15.ViewStmt, context: TransformerContext): any {
    return node;
  }

  IndexStmt(node: PG15.IndexStmt, context: TransformerContext): any {
    return node;
  }

  IndexElem(node: PG15.IndexElem, context: TransformerContext): any {
    return node;
  }

  PartitionElem(node: PG15.PartitionElem, context: TransformerContext): any {
    return node;
  }

  PartitionCmd(node: PG15.PartitionCmd, context: TransformerContext): any {
    return node;
  }

  JoinExpr(node: PG15.JoinExpr, context: TransformerContext): any {
    return node;
  }

  FromExpr(node: PG15.FromExpr, context: TransformerContext): any {
    return node;
  }

  TransactionStmt(node: PG15.TransactionStmt, context: TransformerContext): any {
    return node;
  }

  VariableSetStmt(node: PG15.VariableSetStmt, context: TransformerContext): any {
    return node;
  }

  VariableShowStmt(node: PG15.VariableShowStmt, context: TransformerContext): any {
    return node;
  }

  CreateSchemaStmt(node: PG15.CreateSchemaStmt, context: TransformerContext): any {
    return node;
  }

  RoleSpec(node: PG15.RoleSpec, context: TransformerContext): any {
    return node;
  }

  DropStmt(node: PG15.DropStmt, context: TransformerContext): any {
    return node;
  }

  TruncateStmt(node: PG15.TruncateStmt, context: TransformerContext): any {
    return node;
  }

  ReturnStmt(node: PG15.ReturnStmt, context: TransformerContext): any {
    return node;
  }

  PLAssignStmt(node: PG15.PLAssignStmt, context: TransformerContext): any {
    return node;
  }

  CopyStmt(node: PG15.CopyStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableStmt(node: PG15.AlterTableStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableCmd(node: PG15.AlterTableCmd, context: TransformerContext): any {
    return node;
  }

  CreateFunctionStmt(node: PG15.CreateFunctionStmt, context: TransformerContext): any {
    return node;
  }

  FunctionParameter(node: PG15.FunctionParameter, context: TransformerContext): any {
    return node;
  }

  CreateEnumStmt(node: PG15.CreateEnumStmt, context: TransformerContext): any {
    return node;
  }

  CreateDomainStmt(node: PG15.CreateDomainStmt, context: TransformerContext): any {
    return node;
  }

  CreateRoleStmt(node: PG15.CreateRoleStmt, context: TransformerContext): any {
    return node;
  }

  DefElem(node: PG15.DefElem, context: TransformerContext): any {
    return node;
  }

  CreateTableSpaceStmt(node: PG15.CreateTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  DropTableSpaceStmt(node: PG15.DropTableSpaceStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableSpaceOptionsStmt(node: PG15.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    return node;
  }

  CreateExtensionStmt(node: PG15.CreateExtensionStmt, context: TransformerContext): any {
    return node;
  }

  AlterExtensionStmt(node: PG15.AlterExtensionStmt, context: TransformerContext): any {
    return node;
  }

  CreateFdwStmt(node: PG15.CreateFdwStmt, context: TransformerContext): any {
    return node;
  }

  SetOperationStmt(node: PG15.SetOperationStmt, context: TransformerContext): any {
    return node;
  }

  ReplicaIdentityStmt(node: PG15.ReplicaIdentityStmt, context: TransformerContext): any {
    return node;
  }

  AlterCollationStmt(node: PG15.AlterCollationStmt, context: TransformerContext): any {
    return node;
  }

  AlterDomainStmt(node: PG15.AlterDomainStmt, context: TransformerContext): any {
    return node;
  }

  PrepareStmt(node: PG15.PrepareStmt, context: TransformerContext): any {
    return node;
  }

  ExecuteStmt(node: PG15.ExecuteStmt, context: TransformerContext): any {
    return node;
  }

  DeallocateStmt(node: PG15.DeallocateStmt, context: TransformerContext): any {
    return node;
  }

  NotifyStmt(node: PG15.NotifyStmt, context: TransformerContext): any {
    return node;
  }

  ListenStmt(node: PG15.ListenStmt, context: TransformerContext): any {
    return node;
  }

  UnlistenStmt(node: PG15.UnlistenStmt, context: TransformerContext): any {
    return node;
  }

  CheckPointStmt(node: PG15.CheckPointStmt, context: TransformerContext): any {
    return node;
  }

  LoadStmt(node: PG15.LoadStmt, context: TransformerContext): any {
    return node;
  }

  DiscardStmt(node: PG15.DiscardStmt, context: TransformerContext): any {
    return node;
  }

  CommentStmt(node: PG15.CommentStmt, context: TransformerContext): any {
    return node;
  }

  LockStmt(node: PG15.LockStmt, context: TransformerContext): any {
    return node;
  }

  CreatePolicyStmt(node: PG15.CreatePolicyStmt, context: TransformerContext): any {
    return node;
  }

  AlterPolicyStmt(node: PG15.AlterPolicyStmt, context: TransformerContext): any {
    return node;
  }

  CreateUserMappingStmt(node: PG15.CreateUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  CreateStatsStmt(node: PG15.CreateStatsStmt, context: TransformerContext): any {
    return node;
  }

  StatsElem(node: PG15.StatsElem, context: TransformerContext): any {
    return node;
  }

  CreatePublicationStmt(node: PG15.CreatePublicationStmt, context: TransformerContext): any {
    return node;
  }

  CreateSubscriptionStmt(node: PG15.CreateSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  AlterPublicationStmt(node: PG15.AlterPublicationStmt, context: TransformerContext): any {
    return node;
  }

  AlterSubscriptionStmt(node: PG15.AlterSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DropSubscriptionStmt(node: PG15.DropSubscriptionStmt, context: TransformerContext): any {
    return node;
  }

  DoStmt(node: PG15.DoStmt, context: TransformerContext): any {
    return node;
  }

  InlineCodeBlock(node: PG15.InlineCodeBlock, context: TransformerContext): any {
    return node;
  }

  CallContext(node: PG15.CallContext, context: TransformerContext): any {
    return node;
  }

  ConstraintsSetStmt(node: PG15.ConstraintsSetStmt, context: TransformerContext): any {
    return node;
  }

  AlterSystemStmt(node: PG15.AlterSystemStmt, context: TransformerContext): any {
    return node;
  }

  VacuumRelation(node: PG15.VacuumRelation, context: TransformerContext): any {
    return node;
  }

  DropOwnedStmt(node: PG15.DropOwnedStmt, context: TransformerContext): any {
    return node;
  }

  ReassignOwnedStmt(node: PG15.ReassignOwnedStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSDictionaryStmt(node: PG15.AlterTSDictionaryStmt, context: TransformerContext): any {
    return node;
  }

  AlterTSConfigurationStmt(node: PG15.AlterTSConfigurationStmt, context: TransformerContext): any {
    return node;
  }

  ClosePortalStmt(node: PG15.ClosePortalStmt, context: TransformerContext): any {
    return node;
  }

  FetchStmt(node: PG15.FetchStmt, context: TransformerContext): any {
    return node;
  }

  AlterStatsStmt(node: PG15.AlterStatsStmt, context: TransformerContext): any {
    return node;
  }

  ObjectWithArgs(node: PG15.ObjectWithArgs, context: TransformerContext): any {
    return node;
  }

  AlterOperatorStmt(node: PG15.AlterOperatorStmt, context: TransformerContext): any {
    return node;
  }

  AlterFdwStmt(node: PG15.AlterFdwStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignServerStmt(node: PG15.CreateForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterForeignServerStmt(node: PG15.AlterForeignServerStmt, context: TransformerContext): any {
    return node;
  }

  AlterUserMappingStmt(node: PG15.AlterUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  DropUserMappingStmt(node: PG15.DropUserMappingStmt, context: TransformerContext): any {
    return node;
  }

  ImportForeignSchemaStmt(node: PG15.ImportForeignSchemaStmt, context: TransformerContext): any {
    return node;
  }

  ClusterStmt(node: PG15.ClusterStmt, context: TransformerContext): any {
    return node;
  }

  VacuumStmt(node: PG15.VacuumStmt, context: TransformerContext): any {
    return node;
  }

  ExplainStmt(node: PG15.ExplainStmt, context: TransformerContext): any {
    return node;
  }

  ReindexStmt(node: PG15.ReindexStmt, context: TransformerContext): any {
    return node;
  }

  CallStmt(node: PG15.CallStmt, context: TransformerContext): any {
    return node;
  }

  CreatedbStmt(node: PG15.CreatedbStmt, context: TransformerContext): any {
    return node;
  }

  DropdbStmt(node: PG15.DropdbStmt, context: TransformerContext): any {
    return node;
  }

  RenameStmt(node: PG15.RenameStmt, context: TransformerContext): any {
    return node;
  }

  AlterOwnerStmt(node: PG15.AlterOwnerStmt, context: TransformerContext): any {
    return node;
  }

  GrantStmt(node: PG15.GrantStmt, context: TransformerContext): any {
    return node;
  }

  GrantRoleStmt(node: PG15.GrantRoleStmt, context: TransformerContext): any {
    return node;
  }

  SecLabelStmt(node: PG15.SecLabelStmt, context: TransformerContext): any {
    return node;
  }

  AlterDefaultPrivilegesStmt(node: PG15.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    return node;
  }

  CreateConversionStmt(node: PG15.CreateConversionStmt, context: TransformerContext): any {
    return node;
  }

  CreateCastStmt(node: PG15.CreateCastStmt, context: TransformerContext): any {
    return node;
  }

  CreatePLangStmt(node: PG15.CreatePLangStmt, context: TransformerContext): any {
    return node;
  }

  CreateTransformStmt(node: PG15.CreateTransformStmt, context: TransformerContext): any {
    return node;
  }

  CreateTrigStmt(node: PG15.CreateTrigStmt, context: TransformerContext): any {
    return node;
  }

  TriggerTransition(node: PG15.TriggerTransition, context: TransformerContext): any {
    return node;
  }

  CreateEventTrigStmt(node: PG15.CreateEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  AlterEventTrigStmt(node: PG15.AlterEventTrigStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpClassStmt(node: PG15.CreateOpClassStmt, context: TransformerContext): any {
    return node;
  }

  CreateOpFamilyStmt(node: PG15.CreateOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  AlterOpFamilyStmt(node: PG15.AlterOpFamilyStmt, context: TransformerContext): any {
    return node;
  }

  MergeStmt(node: PG15.MergeStmt, context: TransformerContext): any {
    return node;
  }

  AlterTableMoveAllStmt(node: PG15.AlterTableMoveAllStmt, context: TransformerContext): any {
    return node;
  }

  CreateSeqStmt(node: PG15.CreateSeqStmt, context: TransformerContext): any {
    return node;
  }

  AlterSeqStmt(node: PG15.AlterSeqStmt, context: TransformerContext): any {
    return node;
  }

  CompositeTypeStmt(node: PG15.CompositeTypeStmt, context: TransformerContext): any {
    return node;
  }

  CreateRangeStmt(node: PG15.CreateRangeStmt, context: TransformerContext): any {
    return node;
  }

  AlterEnumStmt(node: PG15.AlterEnumStmt, context: TransformerContext): any {
    return node;
  }

  AlterTypeStmt(node: PG15.AlterTypeStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleStmt(node: PG15.AlterRoleStmt, context: TransformerContext): any {
    return node;
  }

  DropRoleStmt(node: PG15.DropRoleStmt, context: TransformerContext): any {
    return node;
  }

  CreateAggregateStmt(node: PG15.DefineStmt, context: TransformerContext): any {
    return node;
  }

  CreateTableAsStmt(node: PG15.CreateTableAsStmt, context: TransformerContext): any {
    return node;
  }

  RefreshMatViewStmt(node: PG15.RefreshMatViewStmt, context: TransformerContext): any {
    return node;
  }

  AccessPriv(node: PG15.AccessPriv, context: TransformerContext): any {
    return node;
  }

  DefineStmt(node: PG15.DefineStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseStmt(node: PG15.AlterDatabaseStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseRefreshCollStmt(node: PG15.AlterDatabaseRefreshCollStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseSetStmt(node: PG15.AlterDatabaseSetStmt, context: TransformerContext): any {
    return node;
  }

  DeclareCursorStmt(node: PG15.DeclareCursorStmt, context: TransformerContext): any {
    return node;
  }

  PublicationObjSpec(node: PG15.PublicationObjSpec, context: TransformerContext): any {
    return node;
  }

  PublicationTable(node: PG15.PublicationTable, context: TransformerContext): any {
    return node;
  }

  CreateAmStmt(node: PG15.CreateAmStmt, context: TransformerContext): any {
    return node;
  }

  IntoClause(node: PG15.IntoClause, context: TransformerContext): any {
    return node;
  }

  OnConflictExpr(node: PG15.OnConflictExpr, context: TransformerContext): any {
    return node;
  }

  ScanToken(node: PG15.ScanToken, context: TransformerContext): any {
    return node;
  }

  CreateOpClassItem(node: PG15.CreateOpClassItem, context: TransformerContext): any {
    return node;
  }

  Var(node: PG15.Var, context: TransformerContext): any {
    return node;
  }

  TableFunc(node: PG15.TableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFunc(node: PG15.RangeTableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFuncCol(node: PG15.RangeTableFuncCol, context: TransformerContext): any {
    return node;
  }

  RangeFunction(node: PG15.RangeFunction, context: TransformerContext): any {
    return node;
  }

  XmlExpr(node: PG15.XmlExpr, context: TransformerContext): any {
    return node;
  }

  RangeTableSample(node: PG15.RangeTableSample, context: TransformerContext): any {
    return node;
  }

  XmlSerialize(node: PG15.XmlSerialize, context: TransformerContext): any {
    return node;
  }

  RuleStmt(node: PG15.RuleStmt, context: TransformerContext): any {
    return node;
  }

  RangeSubselect(node: PG15.RangeSubselect, context: TransformerContext): any {
    return node;
  }

  SQLValueFunction(node: PG15.SQLValueFunction, context: TransformerContext): any {
    return node;
  }

  GroupingFunc(node: PG15.GroupingFunc, context: TransformerContext): any {
    return node;
  }

  MultiAssignRef(node: PG15.MultiAssignRef, context: TransformerContext): any {
    return node;
  }

  SetToDefault(node: PG15.SetToDefault, context: TransformerContext): any {
    return node;
  }

  CurrentOfExpr(node: PG15.CurrentOfExpr, context: TransformerContext): any {
    return node;
  }

  TableLikeClause(node: PG15.TableLikeClause, context: TransformerContext): any {
    return node;
  }

  AlterFunctionStmt(node: PG15.AlterFunctionStmt, context: TransformerContext): any {
    return node;
  }

  AlterObjectSchemaStmt(node: PG15.AlterObjectSchemaStmt, context: TransformerContext): any {
    return node;
  }

  AlterRoleSetStmt(node: PG15.AlterRoleSetStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignTableStmt(node: PG15.CreateForeignTableStmt, context: TransformerContext): any {
    return node;
  }
}
