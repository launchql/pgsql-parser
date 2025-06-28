import * as PG16 from '../16/types';
import { TransformerContext } from './context';

/**
 * V16 to V17 AST Transformer
 * Transforms PostgreSQL v16 AST nodes to v17 format
 */
export class V16ToV17Transformer {
  
  transform(node: PG16.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  visit(node: PG16.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
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

  getNodeType(node: PG16.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG16.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object') {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG16.ParseResult, context: TransformerContext): any {
    
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 170000, // PG17 version
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

  RawStmt(node: PG16.RawStmt, context: TransformerContext): any {
    return { RawStmt: node };
  }

  SelectStmt(node: PG16.SelectStmt, context: TransformerContext): any {
    return { SelectStmt: node };
  }

  A_Expr(node: PG16.A_Expr, context: TransformerContext): any {
    return { A_Expr: node };
  }

  InsertStmt(node: PG16.InsertStmt, context: TransformerContext): any {
    return { InsertStmt: node };
  }

  UpdateStmt(node: PG16.UpdateStmt, context: TransformerContext): any {
    return { UpdateStmt: node };
  }

  DeleteStmt(node: PG16.DeleteStmt, context: TransformerContext): any {
    return { DeleteStmt: node };
  }

  WithClause(node: PG16.WithClause, context: TransformerContext): any {
    return { WithClause: node };
  }

  ResTarget(node: PG16.ResTarget, context: TransformerContext): any {
    return { ResTarget: node };
  }

  BoolExpr(node: PG16.BoolExpr, context: TransformerContext): any {
    return { BoolExpr: node };
  }

  FuncCall(node: PG16.FuncCall, context: TransformerContext): any {
    return { FuncCall: node };
  }

  FuncExpr(node: PG16.FuncExpr, context: TransformerContext): any {
    return { FuncExpr: node };
  }

  A_Const(node: PG16.A_Const, context: TransformerContext): any {
    return { A_Const: node };
  }

  ColumnRef(node: PG16.ColumnRef, context: TransformerContext): any {
    return { ColumnRef: node };
  }

  TypeName(node: PG16.TypeName, context: TransformerContext): any {
    return { TypeName: node };
  }

  Alias(node: PG16.Alias, context: TransformerContext): any {
    return { Alias: node };
  }

  RangeVar(node: PG16.RangeVar, context: TransformerContext): any {
    return { RangeVar: node };
  }

  A_ArrayExpr(node: PG16.A_ArrayExpr, context: TransformerContext): any {
    return { A_ArrayExpr: node };
  }

  A_Indices(node: PG16.A_Indices, context: TransformerContext): any {
    return { A_Indices: node };
  }

  A_Indirection(node: PG16.A_Indirection, context: TransformerContext): any {
    return { A_Indirection: node };
  }

  A_Star(node: PG16.A_Star, context: TransformerContext): any {
    return { A_Star: node };
  }

  CaseExpr(node: PG16.CaseExpr, context: TransformerContext): any {
    return { CaseExpr: node };
  }

  CoalesceExpr(node: PG16.CoalesceExpr, context: TransformerContext): any {
    return { CoalesceExpr: node };
  }

  TypeCast(node: PG16.TypeCast, context: TransformerContext): any {
    return { TypeCast: node };
  }

  CollateClause(node: PG16.CollateClause, context: TransformerContext): any {
    return { CollateClause: node };
  }

  BooleanTest(node: PG16.BooleanTest, context: TransformerContext): any {
    return { BooleanTest: node };
  }

  NullTest(node: PG16.NullTest, context: TransformerContext): any {
    return { NullTest: node };
  }

  String(node: PG16.String, context: TransformerContext): any {
    return { String: node };
  }
  
  Integer(node: PG16.Integer, context: TransformerContext): any {
    return { Integer: node };
  }
  
  Float(node: PG16.Float, context: TransformerContext): any {
    return { Float: node };
  }
  
  Boolean(node: PG16.Boolean, context: TransformerContext): any {
    return { Boolean: node };
  }
  
  BitString(node: PG16.BitString, context: TransformerContext): any {
    return { BitString: node };
  }
  
  Null(node: PG16.Node, context: TransformerContext): any {
    return { Null: node };
  }

  List(node: PG16.List, context: TransformerContext): any {
    return { List: node };
  }

  CreateStmt(node: PG16.CreateStmt, context: TransformerContext): any {
    return { CreateStmt: node };
  }

  ColumnDef(node: PG16.ColumnDef, context: TransformerContext): any {
    return { ColumnDef: node };
  }

  Constraint(node: PG16.Constraint, context: TransformerContext): any {
    return { Constraint: node };
  }

  SubLink(node: PG16.SubLink, context: TransformerContext): any {
    return { SubLink: node };
  }

  CaseWhen(node: PG16.CaseWhen, context: TransformerContext): any {
    return { CaseWhen: node };
  }

  WindowDef(node: PG16.WindowDef, context: TransformerContext): any {
    return { WindowDef: node };
  }

  SortBy(node: PG16.SortBy, context: TransformerContext): any {
    return { SortBy: node };
  }

  GroupingSet(node: PG16.GroupingSet, context: TransformerContext): any {
    return { GroupingSet: node };
  }

  CommonTableExpr(node: PG16.CommonTableExpr, context: TransformerContext): any {
    return { CommonTableExpr: node };
  }

  ParamRef(node: PG16.ParamRef, context: TransformerContext): any {
    return { ParamRef: node };
  }

  LockingClause(node: any, context: TransformerContext): any {
    return { LockingClause: node };
  }

  MinMaxExpr(node: PG16.MinMaxExpr, context: TransformerContext): any {
    return { MinMaxExpr: node };
  }

  RowExpr(node: PG16.RowExpr, context: TransformerContext): any {
    return { RowExpr: node };
  }

  OpExpr(node: PG16.OpExpr, context: TransformerContext): any {
    return { OpExpr: node };
  }

  DistinctExpr(node: PG16.DistinctExpr, context: TransformerContext): any {
    return { DistinctExpr: node };
  }

  NullIfExpr(node: PG16.NullIfExpr, context: TransformerContext): any {
    return { NullIfExpr: node };
  }

  ScalarArrayOpExpr(node: PG16.ScalarArrayOpExpr, context: TransformerContext): any {
    return { ScalarArrayOpExpr: node };
  }

  Aggref(node: PG16.Aggref, context: TransformerContext): any {
    return { Aggref: node };
  }

  WindowFunc(node: PG16.WindowFunc, context: TransformerContext): any {
    return { WindowFunc: node };
  }

  FieldSelect(node: PG16.FieldSelect, context: TransformerContext): any {
    return { FieldSelect: node };
  }

  RelabelType(node: PG16.RelabelType, context: TransformerContext): any {
    return { RelabelType: node };
  }

  CoerceViaIO(node: PG16.CoerceViaIO, context: TransformerContext): any {
    return { CoerceViaIO: node };
  }

  ArrayCoerceExpr(node: PG16.ArrayCoerceExpr, context: TransformerContext): any {
    return { ArrayCoerceExpr: node };
  }

  ConvertRowtypeExpr(node: PG16.ConvertRowtypeExpr, context: TransformerContext): any {
    return { ConvertRowtypeExpr: node };
  }

  NamedArgExpr(node: PG16.NamedArgExpr, context: TransformerContext): any {
    return { NamedArgExpr: node };
  }

  ViewStmt(node: PG16.ViewStmt, context: TransformerContext): any {
    return { ViewStmt: node };
  }

  IndexStmt(node: PG16.IndexStmt, context: TransformerContext): any {
    return { IndexStmt: node };
  }

  IndexElem(node: PG16.IndexElem, context: TransformerContext): any {
    return { IndexElem: node };
  }

  PartitionElem(node: PG16.PartitionElem, context: TransformerContext): any {
    return { PartitionElem: node };
  }

  PartitionCmd(node: PG16.PartitionCmd, context: TransformerContext): any {
    return { PartitionCmd: node };
  }

  JoinExpr(node: PG16.JoinExpr, context: TransformerContext): any {
    return { JoinExpr: node };
  }

  FromExpr(node: PG16.FromExpr, context: TransformerContext): any {
    return { FromExpr: node };
  }

  TransactionStmt(node: PG16.TransactionStmt, context: TransformerContext): any {
    return { TransactionStmt: node };
  }

  VariableSetStmt(node: PG16.VariableSetStmt, context: TransformerContext): any {
    return { VariableSetStmt: node };
  }

  VariableShowStmt(node: PG16.VariableShowStmt, context: TransformerContext): any {
    return { VariableShowStmt: node };
  }

  CreateSchemaStmt(node: PG16.CreateSchemaStmt, context: TransformerContext): any {
    return { CreateSchemaStmt: node };
  }

  RoleSpec(node: PG16.RoleSpec, context: TransformerContext): any {
    return { RoleSpec: node };
  }

  DropStmt(node: PG16.DropStmt, context: TransformerContext): any {
    return { DropStmt: node };
  }

  TruncateStmt(node: PG16.TruncateStmt, context: TransformerContext): any {
    return { TruncateStmt: node };
  }

  ReturnStmt(node: PG16.ReturnStmt, context: TransformerContext): any {
    return { ReturnStmt: node };
  }

  PLAssignStmt(node: PG16.PLAssignStmt, context: TransformerContext): any {
    return { PLAssignStmt: node };
  }

  CopyStmt(node: PG16.CopyStmt, context: TransformerContext): any {
    return { CopyStmt: node };
  }

  AlterTableStmt(node: PG16.AlterTableStmt, context: TransformerContext): any {
    return { AlterTableStmt: node };
  }

  AlterTableCmd(node: PG16.AlterTableCmd, context: TransformerContext): any {
    return { AlterTableCmd: node };
  }

  CreateFunctionStmt(node: PG16.CreateFunctionStmt, context: TransformerContext): any {
    return { CreateFunctionStmt: node };
  }

  FunctionParameter(node: PG16.FunctionParameter, context: TransformerContext): any {
    return { FunctionParameter: node };
  }

  CreateEnumStmt(node: PG16.CreateEnumStmt, context: TransformerContext): any {
    return { CreateEnumStmt: node };
  }

  CreateDomainStmt(node: PG16.CreateDomainStmt, context: TransformerContext): any {
    return { CreateDomainStmt: node };
  }

  CreateRoleStmt(node: PG16.CreateRoleStmt, context: TransformerContext): any {
    return { CreateRoleStmt: node };
  }

  DefElem(node: PG16.DefElem, context: TransformerContext): any {
    return { DefElem: node };
  }

  CreateTableSpaceStmt(node: PG16.CreateTableSpaceStmt, context: TransformerContext): any {
    return { CreateTableSpaceStmt: node };
  }

  DropTableSpaceStmt(node: PG16.DropTableSpaceStmt, context: TransformerContext): any {
    return { DropTableSpaceStmt: node };
  }

  AlterTableSpaceOptionsStmt(node: PG16.AlterTableSpaceOptionsStmt, context: TransformerContext): any {
    return { AlterTableSpaceOptionsStmt: node };
  }

  CreateExtensionStmt(node: PG16.CreateExtensionStmt, context: TransformerContext): any {
    return { CreateExtensionStmt: node };
  }

  AlterExtensionStmt(node: PG16.AlterExtensionStmt, context: TransformerContext): any {
    return { AlterExtensionStmt: node };
  }

  CreateFdwStmt(node: PG16.CreateFdwStmt, context: TransformerContext): any {
    return { CreateFdwStmt: node };
  }

  SetOperationStmt(node: PG16.SetOperationStmt, context: TransformerContext): any {
    return { SetOperationStmt: node };
  }

  ReplicaIdentityStmt(node: PG16.ReplicaIdentityStmt, context: TransformerContext): any {
    return { ReplicaIdentityStmt: node };
  }

  AlterCollationStmt(node: PG16.AlterCollationStmt, context: TransformerContext): any {
    return { AlterCollationStmt: node };
  }

  AlterDomainStmt(node: PG16.AlterDomainStmt, context: TransformerContext): any {
    return { AlterDomainStmt: node };
  }

  PrepareStmt(node: PG16.PrepareStmt, context: TransformerContext): any {
    return { PrepareStmt: node };
  }

  ExecuteStmt(node: PG16.ExecuteStmt, context: TransformerContext): any {
    return { ExecuteStmt: node };
  }

  DeallocateStmt(node: PG16.DeallocateStmt, context: TransformerContext): any {
    return { DeallocateStmt: node };
  }

  NotifyStmt(node: PG16.NotifyStmt, context: TransformerContext): any {
    return { NotifyStmt: node };
  }

  ListenStmt(node: PG16.ListenStmt, context: TransformerContext): any {
    return { ListenStmt: node };
  }

  UnlistenStmt(node: PG16.UnlistenStmt, context: TransformerContext): any {
    return { UnlistenStmt: node };
  }

  CheckPointStmt(node: PG16.CheckPointStmt, context: TransformerContext): any {
    return { CheckPointStmt: node };
  }

  LoadStmt(node: PG16.LoadStmt, context: TransformerContext): any {
    return { LoadStmt: node };
  }

  DiscardStmt(node: PG16.DiscardStmt, context: TransformerContext): any {
    return { DiscardStmt: node };
  }

  CommentStmt(node: PG16.CommentStmt, context: TransformerContext): any {
    return { CommentStmt: node };
  }

  LockStmt(node: PG16.LockStmt, context: TransformerContext): any {
    return { LockStmt: node };
  }

  CreatePolicyStmt(node: PG16.CreatePolicyStmt, context: TransformerContext): any {
    return { CreatePolicyStmt: node };
  }

  AlterPolicyStmt(node: PG16.AlterPolicyStmt, context: TransformerContext): any {
    return { AlterPolicyStmt: node };
  }

  CreateUserMappingStmt(node: PG16.CreateUserMappingStmt, context: TransformerContext): any {
    return { CreateUserMappingStmt: node };
  }

  CreateStatsStmt(node: PG16.CreateStatsStmt, context: TransformerContext): any {
    return { CreateStatsStmt: node };
  }

  StatsElem(node: PG16.StatsElem, context: TransformerContext): any {
    return { StatsElem: node };
  }

  CreatePublicationStmt(node: PG16.CreatePublicationStmt, context: TransformerContext): any {
    return { CreatePublicationStmt: node };
  }

  CreateSubscriptionStmt(node: PG16.CreateSubscriptionStmt, context: TransformerContext): any {
    return { CreateSubscriptionStmt: node };
  }

  AlterPublicationStmt(node: PG16.AlterPublicationStmt, context: TransformerContext): any {
    return { AlterPublicationStmt: node };
  }

  AlterSubscriptionStmt(node: PG16.AlterSubscriptionStmt, context: TransformerContext): any {
    return { AlterSubscriptionStmt: node };
  }

  DropSubscriptionStmt(node: PG16.DropSubscriptionStmt, context: TransformerContext): any {
    return { DropSubscriptionStmt: node };
  }

  DoStmt(node: PG16.DoStmt, context: TransformerContext): any {
    return { DoStmt: node };
  }

  InlineCodeBlock(node: PG16.InlineCodeBlock, context: TransformerContext): any {
    return { InlineCodeBlock: node };
  }

  CallContext(node: PG16.CallContext, context: TransformerContext): any {
    return { CallContext: node };
  }

  ConstraintsSetStmt(node: PG16.ConstraintsSetStmt, context: TransformerContext): any {
    return { ConstraintsSetStmt: node };
  }

  AlterSystemStmt(node: PG16.AlterSystemStmt, context: TransformerContext): any {
    return { AlterSystemStmt: node };
  }

  VacuumRelation(node: PG16.VacuumRelation, context: TransformerContext): any {
    return { VacuumRelation: node };
  }

  DropOwnedStmt(node: PG16.DropOwnedStmt, context: TransformerContext): any {
    return { DropOwnedStmt: node };
  }

  ReassignOwnedStmt(node: PG16.ReassignOwnedStmt, context: TransformerContext): any {
    return { ReassignOwnedStmt: node };
  }

  AlterTSDictionaryStmt(node: PG16.AlterTSDictionaryStmt, context: TransformerContext): any {
    return { AlterTSDictionaryStmt: node };
  }

  AlterTSConfigurationStmt(node: PG16.AlterTSConfigurationStmt, context: TransformerContext): any {
    return { AlterTSConfigurationStmt: node };
  }

  ClosePortalStmt(node: PG16.ClosePortalStmt, context: TransformerContext): any {
    return { ClosePortalStmt: node };
  }

  FetchStmt(node: PG16.FetchStmt, context: TransformerContext): any {
    return { FetchStmt: node };
  }

  AlterStatsStmt(node: PG16.AlterStatsStmt, context: TransformerContext): any {
    return { AlterStatsStmt: node };
  }

  ObjectWithArgs(node: PG16.ObjectWithArgs, context: TransformerContext): any {
    return { ObjectWithArgs: node };
  }

  AlterOperatorStmt(node: PG16.AlterOperatorStmt, context: TransformerContext): any {
    return { AlterOperatorStmt: node };
  }

  AlterFdwStmt(node: PG16.AlterFdwStmt, context: TransformerContext): any {
    return { AlterFdwStmt: node };
  }

  CreateForeignServerStmt(node: PG16.CreateForeignServerStmt, context: TransformerContext): any {
    return { CreateForeignServerStmt: node };
  }

  AlterForeignServerStmt(node: PG16.AlterForeignServerStmt, context: TransformerContext): any {
    return { AlterForeignServerStmt: node };
  }

  AlterUserMappingStmt(node: PG16.AlterUserMappingStmt, context: TransformerContext): any {
    return { AlterUserMappingStmt: node };
  }

  DropUserMappingStmt(node: PG16.DropUserMappingStmt, context: TransformerContext): any {
    return { DropUserMappingStmt: node };
  }

  ImportForeignSchemaStmt(node: PG16.ImportForeignSchemaStmt, context: TransformerContext): any {
    return { ImportForeignSchemaStmt: node };
  }

  ClusterStmt(node: PG16.ClusterStmt, context: TransformerContext): any {
    return { ClusterStmt: node };
  }

  VacuumStmt(node: PG16.VacuumStmt, context: TransformerContext): any {
    return { VacuumStmt: node };
  }

  ExplainStmt(node: PG16.ExplainStmt, context: TransformerContext): any {
    return { ExplainStmt: node };
  }

  ReindexStmt(node: PG16.ReindexStmt, context: TransformerContext): any {
    return { ReindexStmt: node };
  }

  CallStmt(node: PG16.CallStmt, context: TransformerContext): any {
    return { CallStmt: node };
  }

  CreatedbStmt(node: PG16.CreatedbStmt, context: TransformerContext): any {
    return { CreatedbStmt: node };
  }

  DropdbStmt(node: PG16.DropdbStmt, context: TransformerContext): any {
    return { DropdbStmt: node };
  }

  RenameStmt(node: PG16.RenameStmt, context: TransformerContext): any {
    return { RenameStmt: node };
  }

  AlterOwnerStmt(node: PG16.AlterOwnerStmt, context: TransformerContext): any {
    return { AlterOwnerStmt: node };
  }

  GrantStmt(node: PG16.GrantStmt, context: TransformerContext): any {
    return { GrantStmt: node };
  }

  GrantRoleStmt(node: PG16.GrantRoleStmt, context: TransformerContext): any {
    return { GrantRoleStmt: node };
  }

  SecLabelStmt(node: PG16.SecLabelStmt, context: TransformerContext): any {
    return { SecLabelStmt: node };
  }

  AlterDefaultPrivilegesStmt(node: PG16.AlterDefaultPrivilegesStmt, context: TransformerContext): any {
    return { AlterDefaultPrivilegesStmt: node };
  }

  CreateConversionStmt(node: PG16.CreateConversionStmt, context: TransformerContext): any {
    return { CreateConversionStmt: node };
  }

  CreateCastStmt(node: PG16.CreateCastStmt, context: TransformerContext): any {
    return { CreateCastStmt: node };
  }

  CreatePLangStmt(node: PG16.CreatePLangStmt, context: TransformerContext): any {
    return { CreatePLangStmt: node };
  }

  CreateTransformStmt(node: PG16.CreateTransformStmt, context: TransformerContext): any {
    return { CreateTransformStmt: node };
  }

  CreateTrigStmt(node: PG16.CreateTrigStmt, context: TransformerContext): any {
    return { CreateTrigStmt: node };
  }

  TriggerTransition(node: PG16.TriggerTransition, context: TransformerContext): any {
    return { TriggerTransition: node };
  }

  CreateEventTrigStmt(node: PG16.CreateEventTrigStmt, context: TransformerContext): any {
    return { CreateEventTrigStmt: node };
  }

  AlterEventTrigStmt(node: PG16.AlterEventTrigStmt, context: TransformerContext): any {
    return { AlterEventTrigStmt: node };
  }

  CreateOpClassStmt(node: PG16.CreateOpClassStmt, context: TransformerContext): any {
    return { CreateOpClassStmt: node };
  }

  CreateOpFamilyStmt(node: PG16.CreateOpFamilyStmt, context: TransformerContext): any {
    return { CreateOpFamilyStmt: node };
  }

  AlterOpFamilyStmt(node: PG16.AlterOpFamilyStmt, context: TransformerContext): any {
    return { AlterOpFamilyStmt: node };
  }

  MergeStmt(node: PG16.MergeStmt, context: TransformerContext): any {
    return { MergeStmt: node };
  }

  AlterTableMoveAllStmt(node: PG16.AlterTableMoveAllStmt, context: TransformerContext): any {
    return { AlterTableMoveAllStmt: node };
  }

  CreateSeqStmt(node: PG16.CreateSeqStmt, context: TransformerContext): any {
    return { CreateSeqStmt: node };
  }

  AlterSeqStmt(node: PG16.AlterSeqStmt, context: TransformerContext): any {
    return { AlterSeqStmt: node };
  }

  CompositeTypeStmt(node: PG16.CompositeTypeStmt, context: TransformerContext): any {
    return { CompositeTypeStmt: node };
  }

  CreateRangeStmt(node: PG16.CreateRangeStmt, context: TransformerContext): any {
    return { CreateRangeStmt: node };
  }

  AlterEnumStmt(node: PG16.AlterEnumStmt, context: TransformerContext): any {
    return { AlterEnumStmt: node };
  }

  AlterTypeStmt(node: PG16.AlterTypeStmt, context: TransformerContext): any {
    return { AlterTypeStmt: node };
  }

  AlterRoleStmt(node: PG16.AlterRoleStmt, context: TransformerContext): any {
    return { AlterRoleStmt: node };
  }

  DropRoleStmt(node: PG16.DropRoleStmt, context: TransformerContext): any {
    return { DropRoleStmt: node };
  }

  CreateAggregateStmt(node: PG16.DefineStmt, context: TransformerContext): any {
    return { CreateAggregateStmt: node };
  }

  CreateTableAsStmt(node: PG16.CreateTableAsStmt, context: TransformerContext): any {
    return { CreateTableAsStmt: node };
  }

  RefreshMatViewStmt(node: PG16.RefreshMatViewStmt, context: TransformerContext): any {
    return { RefreshMatViewStmt: node };
  }

  AccessPriv(node: PG16.AccessPriv, context: TransformerContext): any {
    return node;
  }

  DefineStmt(node: PG16.DefineStmt, context: TransformerContext): any {
    return { DefineStmt: node };
  }

  AlterDatabaseStmt(node: PG16.AlterDatabaseStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseRefreshCollStmt(node: PG16.AlterDatabaseRefreshCollStmt, context: TransformerContext): any {
    return node;
  }

  AlterDatabaseSetStmt(node: PG16.AlterDatabaseSetStmt, context: TransformerContext): any {
    return node;
  }

  DeclareCursorStmt(node: PG16.DeclareCursorStmt, context: TransformerContext): any {
    return { DeclareCursorStmt: node };
  }

  PublicationObjSpec(node: PG16.PublicationObjSpec, context: TransformerContext): any {
    return node;
  }

  PublicationTable(node: PG16.PublicationTable, context: TransformerContext): any {
    return node;
  }

  CreateAmStmt(node: PG16.CreateAmStmt, context: TransformerContext): any {
    return { CreateAmStmt: node };
  }

  IntoClause(node: PG16.IntoClause, context: TransformerContext): any {
    return node;
  }

  OnConflictExpr(node: PG16.OnConflictExpr, context: TransformerContext): any {
    return node;
  }

  ScanToken(node: PG16.ScanToken, context: TransformerContext): any {
    return node;
  }

  CreateOpClassItem(node: PG16.CreateOpClassItem, context: TransformerContext): any {
    return node;
  }

  Var(node: PG16.Var, context: TransformerContext): any {
    return node;
  }

  TableFunc(node: PG16.TableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFunc(node: PG16.RangeTableFunc, context: TransformerContext): any {
    return node;
  }

  RangeTableFuncCol(node: PG16.RangeTableFuncCol, context: TransformerContext): any {
    return node;
  }

  JsonArrayQueryConstructor(node: PG16.JsonArrayQueryConstructor, context: TransformerContext): any {
    return node;
  }

  RangeFunction(node: PG16.RangeFunction, context: TransformerContext): any {
    return node;
  }

  XmlExpr(node: PG16.XmlExpr, context: TransformerContext): any {
    return node;
  }

  RangeTableSample(node: PG16.RangeTableSample, context: TransformerContext): any {
    return node;
  }

  XmlSerialize(node: PG16.XmlSerialize, context: TransformerContext): any {
    return node;
  }

  RuleStmt(node: PG16.RuleStmt, context: TransformerContext): any {
    return { RuleStmt: node };
  }

  RangeSubselect(node: PG16.RangeSubselect, context: TransformerContext): any {
    return node;
  }

  SQLValueFunction(node: PG16.SQLValueFunction, context: TransformerContext): any {
    return node;
  }

  GroupingFunc(node: PG16.GroupingFunc, context: TransformerContext): any {
    return node;
  }

  MultiAssignRef(node: PG16.MultiAssignRef, context: TransformerContext): any {
    return node;
  }

  SetToDefault(node: PG16.SetToDefault, context: TransformerContext): any {
    return node;
  }

  CurrentOfExpr(node: PG16.CurrentOfExpr, context: TransformerContext): any {
    return node;
  }

  TableLikeClause(node: PG16.TableLikeClause, context: TransformerContext): any {
    return node;
  }

  AlterFunctionStmt(node: PG16.AlterFunctionStmt, context: TransformerContext): any {
    return { AlterFunctionStmt: node };
  }

  AlterObjectSchemaStmt(node: PG16.AlterObjectSchemaStmt, context: TransformerContext): any {
    return { AlterObjectSchemaStmt: node };
  }

  AlterRoleSetStmt(node: PG16.AlterRoleSetStmt, context: TransformerContext): any {
    return node;
  }

  CreateForeignTableStmt(node: PG16.CreateForeignTableStmt, context: TransformerContext): any {
    return { CreateForeignTableStmt: node };
  }
}
