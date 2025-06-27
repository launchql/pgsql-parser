import * as PG13 from '../13/types';
import { TransformerContext } from './context';

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

    if (Array.isArray(node)) {
      return node.map(item => this.transform(item, context));
    }

    // Handle ParseResult objects specially
    if (typeof node === 'object' && node !== null && 'version' in node && 'stmts' in node) {
      return this.ParseResult(node as PG13.ParseResult, context);
    }

    try {
      return this.visit(node, context);
    } catch (error) {
      const nodeType = Object.keys(node)[0];
      throw new Error(`Error transforming ${nodeType}: ${(error as Error).message}`);
    }
  }

  visit(node: PG13.Node, context: TransformerContext = { parentNodeTypes: [] }): any {
    if (!context.parentNodeTypes || !Array.isArray(context.parentNodeTypes)) {
      context = { ...context, parentNodeTypes: [] };
    }
    
    const nodeType = this.getNodeType(node);
    
    // Handle empty objects
    if (!nodeType) {
      return {};
    }
    
    const nodeData = this.getNodeData(node);

    if (nodeType === 'WithClause') {
      console.log('Found WithClause node, nodeData:', JSON.stringify(nodeData, null, 2));
    }

    const methodName = nodeType as keyof this;
    if (typeof this[methodName] === 'function') {
      const childContext: TransformerContext = {
        ...context,
        parentNodeTypes: [...context.parentNodeTypes, nodeType]
      };
      const result = (this[methodName] as any)(nodeData, childContext);
      
      return result;
    }
    
    // If no specific method, use transformGenericNode to handle nested transformations
    return this.transformGenericNode(node, context);
  }

  private transformGenericNode(node: any, context: TransformerContext): any {
    if (typeof node !== 'object' || node === null) return node;
    if (Array.isArray(node)) return node.map(item => this.transform(item, context));

    const keys = Object.keys(node);
    if (keys.length === 1 && typeof node[keys[0]] === 'object' && node[keys[0]] !== null) {
      const nodeType = keys[0];
      const nodeData = node[keys[0]];
      
      if ('ctes' in nodeData) {
        console.log('transformGenericNode: Processing node with ctes:', {
          nodeType,
          ctesType: typeof nodeData.ctes,
          isArray: Array.isArray(nodeData.ctes)
        });
      }
      
      const transformedData: any = {};
      for (const [key, value] of Object.entries(nodeData)) {
        if (key === 'ctes' && Array.isArray(value)) {
          transformedData[key] = value.map(item => this.transform(item as any, context));
        } else if (key === 'objname' && typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            transformedData[key] = value.map(item => this.transform(item as any, context));
          } else {
            const keys = Object.keys(value);
            const isNumericKeysObject = keys.every(k => /^\d+$/.test(k));
            
            if (isNumericKeysObject && keys.length > 0) {
              const shouldPreserve = this.shouldPreserveObjnameAsObject(context);
              if (shouldPreserve) {
                const transformedObjname: any = {};
                Object.keys(value).forEach(k => {
                  transformedObjname[k] = this.transform((value as any)[k], context);
                });
                transformedData[key] = transformedObjname;
              } else {
                const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
                transformedData[key] = sortedKeys.map(k => this.transform((value as any)[k], context));
              }
            }else {
              // Regular object transformation
              transformedData[key] = this.transform(value as any, context);
            }
          }
        } else if (Array.isArray(value)) {
          transformedData[key] = value.map(item => this.transform(item as any, context));
        } else if (typeof value === 'object' && value !== null) {
          transformedData[key] = this.transform(value as any, context);
        } else {
          transformedData[key] = value;
        }
      }
      
      return { [nodeType]: transformedData };
    }


    const result: any = {};
    for (const [key, value] of Object.entries(node)) {
      if (Array.isArray(value)) {
        result[key] = value.map(item => this.transform(item as any, context));
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.transform(value as any, context);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  getNodeType(node: PG13.Node): any {
    return Object.keys(node)[0];
  }

  getNodeData(node: PG13.Node): any {
    const keys = Object.keys(node);
    if (keys.length === 1 && typeof (node as any)[keys[0]] === 'object' && (node as any)[keys[0]] !== null) {
      return (node as any)[keys[0]];
    }
    return node;
  }

  ParseResult(node: PG13.ParseResult, context: TransformerContext): any {
    if (node && typeof node === 'object' && 'version' in node && 'stmts' in node) {
      return {
        version: 170004,
        stmts: node.stmts.map((stmt: any) => {
          if (stmt && typeof stmt === 'object' && 'stmt' in stmt) {
            return { ...stmt, stmt: this.transform(stmt.stmt, context) };
          }
          return this.transform(stmt, context);
        })
      };
    }
    return node;
  }

  FuncCall(node: PG13.FuncCall, context: TransformerContext): any {
    const result: any = {};
    
    if (node.funcname !== undefined) {
      let funcname = Array.isArray(node.funcname)
        ? node.funcname.map(item => this.transform(item as any, context))
        : this.transform(node.funcname as any, context);
      
      if (Array.isArray(funcname) && funcname.length >= 2) {
        const lastName = funcname[funcname.length - 1];
        if (lastName && typeof lastName === 'object' && 'String' in lastName) {
          const funcName = lastName.String.str || lastName.String.sval;
          if (funcName === 'date_part') {
            funcname = [...funcname];
            funcname[funcname.length - 1] = {
              String: { str: 'extract' }
            };
          }
        }
        
        if (this.isInCreateDomainContext(context) && funcname.length >= 2) {
          const firstElement = funcname[0];
          if (firstElement && typeof firstElement === 'object' && 'String' in firstElement) {
            const prefix = firstElement.String.str || firstElement.String.sval;
            if (prefix === 'pg_catalog') {
              funcname = funcname.slice(1);
            }
          }
        }
        
      }
      
      result.funcname = funcname;
    }
    
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    
    if (node.agg_order !== undefined) {
      result.agg_order = Array.isArray(node.agg_order)
        ? node.agg_order.map(item => this.transform(item as any, context))
        : this.transform(node.agg_order as any, context);
    }
    
    if (node.agg_filter !== undefined) {
      result.agg_filter = this.transform(node.agg_filter as any, context);
    }
    
    if (node.agg_within_group !== undefined) {
      result.agg_within_group = node.agg_within_group;
    }
    
    if (node.agg_star !== undefined) {
      result.agg_star = node.agg_star;
    }
    
    if (node.agg_distinct !== undefined) {
      result.agg_distinct = node.agg_distinct;
    }
    
    if (node.func_variadic !== undefined) {
      result.func_variadic = node.func_variadic;
    }
    
    if (node.over !== undefined) {
      result.over = this.transform(node.over as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    // Only add funcformat in specific contexts where it's expected in PG14
    if (this.shouldAddFuncformat(context)) {
      const nodeForFuncformat = { ...node, funcname: result.funcname };
      const funcformatValue = this.getFuncformatValue(nodeForFuncformat, context);
      if (funcformatValue !== null) {
        result.funcformat = funcformatValue;
      }
    }
    
    return { FuncCall: result };
  }

  private shouldAddFuncformat(context: TransformerContext): boolean {
    if (this.isInCheckConstraintContext(context)) {
      return false;
    }
    
    if (this.isInCommentContext(context)) {
      return false;
    }
    
    if (this.isInTypeCastContext(context)) {
      return false;
    }
    
    if (this.isInXmlExprContext(context)) {
      return false;
    }
    
    if (this.isInInsertContext(context)) {
      return false;
    }
    
    if (this.isInUpdateContext(context)) {
      return false;
    }
    
    if (this.isInRangeFunctionContext(context)) {
      return false;
    }
    
    if (this.isInSortByContext(context)) {
      return false;
    }
    
    if (this.isInDefaultConstraintContext(context)) {
      return false;
    }
    
    if (this.isInPolicyContext(context)) {
      return false;
    }
    
    if (this.isInSelectFromContext(context)) {
      return false;
    }
    
    if (this.isInCreateIndexContext(context)) {
      return false;
    }
    
    if (this.isInConstraintContext(context)) {
      return false;
    }
    
    return true;
  }

  private isInCheckConstraintContext(context: TransformerContext): boolean {
    const path = context.path || [];
    
    const hasDirectConstraint = path.some((node: any) => 
      node && typeof node === 'object' && 
      ('Constraint' in node && node.Constraint?.contype === 'CONSTR_CHECK')
    );
    
    if (hasDirectConstraint) {
      return true;
    }
    
    const hasAlterTableConstraint = path.some((node: any) => 
      node && typeof node === 'object' && 
      ('AlterTableCmd' in node && 
       node.AlterTableCmd?.def?.Constraint?.contype === 'CONSTR_CHECK')
    );
    
    if (hasAlterTableConstraint) {
      return true;
    }
    
    if (context.parentNodeTypes) {
      const hasConstraintParent = context.parentNodeTypes.some((parentType: string) =>
        parentType === 'Constraint' || parentType === 'AlterTableCmd'
      );
      
      if (hasConstraintParent && context.parent?.currentNode) {
        const parentNode = context.parent.currentNode;
        if ('Constraint' in parentNode && parentNode.Constraint?.contype === 'CONSTR_CHECK') {
          return true;
        }
        if ('AlterTableCmd' in parentNode && 
            parentNode.AlterTableCmd?.def?.Constraint?.contype === 'CONSTR_CHECK') {
          return true;
        }
      }
    }
    
    return false;
  }

  private isInCommentContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'CommentStmt' in node
    );
  }

  private isInTypeCastContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'TypeCast' in node
    );
  }

  private isInInsertContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'InsertStmt' in node
    );
  }

  private isInUpdateContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'UpdateStmt' in node
    );
  }

  private isInXmlExprContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'XmlExpr' in node
    );
  }

  private isInRangeFunctionContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'RangeFunction' in node
    );
  }

  private isInSortByContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'SortBy' in node
    );
  }

  private isInDefaultConstraintContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'Constraint' in node && 
      node.Constraint && node.Constraint.contype === 'CONSTR_DEFAULT'
    );
  }

  private isInPolicyContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'CreatePolicyStmt' in node
    );
  }

  private isInSelectFromContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any, index: number) => {
      if (node && typeof node === 'object' && 'SelectStmt' in node) {
        const nextNode = path[index + 1];
        return nextNode && typeof nextNode === 'string' && nextNode === 'fromClause';
      }
      return false;
    });
  }
  private isInCreateIndexContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'IndexStmt' in node
    );
  }

  private isInConstraintContext(context: TransformerContext): boolean {
    const path = context.path || [];
    return path.some((node: any) => 
      node && typeof node === 'object' && 'Constraint' in node
    );
  }

  private isInCreateDomainContext(context: TransformerContext): boolean {
    const parentNodeTypes = context.parentNodeTypes || [];
    return parentNodeTypes.includes('CreateDomainStmt');
  }

  private isStandardFunctionCallSyntax(node: any, context: TransformerContext): boolean {
    if (!node.args || !Array.isArray(node.args)) {
      return true; // Default to function call syntax
    }
    
    if (this.isInCreateDomainContext(context) || this.isInConstraintContext(context)) {
      return true;
    }
    
    if (node.args.length === 2) {
      return false; // FROM syntax
    }
    
    if (node.args.length === 3) {
      const thirdArg = node.args[2];
      if (thirdArg && typeof thirdArg === 'object' && 'TypeCast' in thirdArg) {
        return false; // FOR syntax with length cast
      }
    }
    
    return true; // Default to function call syntax
  }

  private isSqlStandardSyntax(node: any, context: TransformerContext): boolean {
    return !this.isStandardFunctionCallSyntax(node, context);
  }


  CallStmt(node: PG13.CallStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.funccall !== undefined) {
      const wrappedFuncCall = { FuncCall: node.funccall };
      const transformedFuncCall = this.transform(wrappedFuncCall as any, context);
      result.funccall = transformedFuncCall.FuncCall || transformedFuncCall;
    }
    
    return { CallStmt: result };
  }

  CommentStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (result.object !== undefined) {
      const childContext = {
        ...context,
        commentObjtype: result.objtype
      };
      result.object = this.transform(result.object, childContext);
    }
    
    if (result.comment !== undefined) {
      result.comment = result.comment;
    }
    
    if (result.objtype !== undefined) {
      result.objtype = result.objtype;
    }
    
    return { CommentStmt: result };
  }

  DropStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (result.objects !== undefined) {
      const childContext = {
        ...context,
        dropRemoveType: result.removeType
      };
      result.objects = Array.isArray(result.objects)
        ? result.objects.map((item: any) => this.transform(item, childContext))
        : this.transform(result.objects, childContext);
    }
    
    if (result.removeType !== undefined) {
      result.removeType = result.removeType;
    }
    
    if (result.behavior !== undefined) {
      result.behavior = result.behavior;
    }
    
    if (result.missing_ok !== undefined) {
      result.missing_ok = result.missing_ok;
    }
    
    if (result.concurrent !== undefined) {
      result.concurrent = result.concurrent;
    }
    
    return { DropStmt: result };
  }

  InsertStmt(node: PG13.InsertStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with InsertStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'InsertStmt']
    };
    
    if (result.relation !== undefined) {
      result.relation = this.transform(result.relation, childContext);
    }
    
    if (result.cols !== undefined) {
      result.cols = Array.isArray(result.cols)
        ? result.cols.map((item: any) => this.transform(item, childContext))
        : this.transform(result.cols, childContext);
    }
    
    if (result.selectStmt !== undefined) {
      result.selectStmt = this.transform(result.selectStmt, childContext);
    }
    
    if (result.onConflictClause !== undefined) {
      result.onConflictClause = this.transform(result.onConflictClause, childContext);
    }
    
    if (result.returningList !== undefined) {
      result.returningList = Array.isArray(result.returningList)
        ? result.returningList.map((item: any) => this.transform(item, childContext))
        : this.transform(result.returningList, childContext);
    }
    
    if (result.withClause !== undefined) {
      if (result.withClause.ctes && Array.isArray(result.withClause.ctes)) {
        const transformedWithClause = { ...result.withClause };
        transformedWithClause.ctes = result.withClause.ctes.map((cte: any) => this.transform(cte, childContext));
        if (result.withClause.recursive !== undefined) {
          transformedWithClause.recursive = result.withClause.recursive;
        }
        if (result.withClause.location !== undefined) {
          transformedWithClause.location = result.withClause.location;
        }
        result.withClause = transformedWithClause;
      } else {
        result.withClause = this.transform(result.withClause, childContext);
      }
    }
    
    return { InsertStmt: result };
  }

  UpdateStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with UpdateStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'UpdateStmt']
    };
    
    if (result.relation !== undefined) {
      result.relation = this.transform(result.relation, childContext);
    }
    
    if (result.targetList !== undefined) {
      result.targetList = Array.isArray(result.targetList)
        ? result.targetList.map((item: any) => this.transform(item, childContext))
        : this.transform(result.targetList, childContext);
    }
    
    if (result.whereClause !== undefined) {
      result.whereClause = this.transform(result.whereClause, childContext);
    }
    
    if (result.fromClause !== undefined) {
      result.fromClause = Array.isArray(result.fromClause)
        ? result.fromClause.map((item: any) => this.transform(item, childContext))
        : this.transform(result.fromClause, childContext);
    }
    
    if (result.returningList !== undefined) {
      result.returningList = Array.isArray(result.returningList)
        ? result.returningList.map((item: any) => this.transform(item, childContext))
        : this.transform(result.returningList, childContext);
    }
    
    if (result.withClause !== undefined) {
      if (result.withClause.ctes && Array.isArray(result.withClause.ctes)) {
        const transformedWithClause = { ...result.withClause };
        transformedWithClause.ctes = result.withClause.ctes.map((cte: any) => this.transform(cte, childContext));
        if (result.withClause.recursive !== undefined) {
          transformedWithClause.recursive = result.withClause.recursive;
        }
        if (result.withClause.location !== undefined) {
          transformedWithClause.location = result.withClause.location;
        }
        result.withClause = transformedWithClause;
      } else {
        result.withClause = this.transform(result.withClause, childContext);
      }
    }
    
    return { UpdateStmt: result };
  }

  DeleteStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with DeleteStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'DeleteStmt']
    };
    
    if (result.relation !== undefined) {
      result.relation = this.transform(result.relation, childContext);
    }
    
    if (result.usingClause !== undefined) {
      result.usingClause = Array.isArray(result.usingClause)
        ? result.usingClause.map((item: any) => this.transform(item, childContext))
        : this.transform(result.usingClause, childContext);
    }
    
    if (result.whereClause !== undefined) {
      result.whereClause = this.transform(result.whereClause, childContext);
    }
    
    if (result.returningList !== undefined) {
      result.returningList = Array.isArray(result.returningList)
        ? result.returningList.map((item: any) => this.transform(item, childContext))
        : this.transform(result.returningList, childContext);
    }
    
    if (result.withClause !== undefined) {
      if (result.withClause.ctes && Array.isArray(result.withClause.ctes)) {
        const transformedWithClause = { ...result.withClause };
        transformedWithClause.ctes = result.withClause.ctes.map((cte: any) => this.transform(cte, childContext));
        if (result.withClause.recursive !== undefined) {
          transformedWithClause.recursive = result.withClause.recursive;
        }
        if (result.withClause.location !== undefined) {
          transformedWithClause.location = result.withClause.location;
        }
        result.withClause = transformedWithClause;
      } else {
        result.withClause = this.transform(result.withClause, childContext);
      }
    }
    
    return { DeleteStmt: result };
  }

  CreateOpClassStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with CreateOpClassStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'CreateOpClassStmt']
    };
    
    if (result.opclassname !== undefined) {
      result.opclassname = Array.isArray(result.opclassname)
        ? result.opclassname.map((item: any) => this.transform(item, childContext))
        : this.transform(result.opclassname, childContext);
    }
    
    if (result.opfamilyname !== undefined) {
      result.opfamilyname = Array.isArray(result.opfamilyname)
        ? result.opfamilyname.map((item: any) => this.transform(item, childContext))
        : this.transform(result.opfamilyname, childContext);
    }
    
    if (result.amname !== undefined) {
      result.amname = this.transform(result.amname, childContext);
    }
    
    if (result.datatype !== undefined) {
      result.datatype = this.transform(result.datatype, childContext);
    }
    
    if (result.items !== undefined) {
      result.items = Array.isArray(result.items)
        ? result.items.map((item: any) => this.transform(item, childContext))
        : this.transform(result.items, childContext);
    }
    
    return { CreateOpClassStmt: result };
  }

  CreateOpClassItem(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with CreateOpClassItem as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'CreateOpClassItem']
    };
    
    if (result.name !== undefined) {
      result.name = this.transform(result.name, childContext);
      
      if (result.name && typeof result.name === 'object' && result.name.objname) {
        const objname = result.name.objname;
        if (typeof objname === 'object' && !Array.isArray(objname) && objname !== null) {
          const keys = Object.keys(objname);
          const isNumericKeysObject = keys.length > 0 && keys.every(k => /^\d+$/.test(k));
          if (isNumericKeysObject) {
            const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
            result.name.objname = sortedKeys.map(key => this.transform(objname[key], childContext));
          }
        }
        
        if (result.name.objargs && !result.name.objfuncargs) {
          // Check if this is an operator by looking at the objname
          const isOperator = this.isOperatorName(result.name.objname);
          
          if (!isOperator) {
            result.name.objfuncargs = Array.isArray(result.name.objargs)
              ? result.name.objargs.map((arg: any) => this.createFunctionParameterFromTypeName(arg))
              : [this.createFunctionParameterFromTypeName(result.name.objargs)];
          }
        }
      }
    }
    
    if (result.args !== undefined) {
      result.args = Array.isArray(result.args)
        ? result.args.map((item: any) => this.transform(item, childContext))
        : this.transform(result.args, childContext);
    }
    
    if (result.storedtype !== undefined) {
      result.storedtype = this.transform(result.storedtype, childContext);
    }
    
    return { CreateOpClassItem: result };
  }

  CreateAccessMethodStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with CreateAccessMethodStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'CreateAccessMethodStmt']
    };
    
    if (result.amname !== undefined) {
      result.amname = this.transform(result.amname, childContext);
    }
    
    if (result.handler_name !== undefined) {
      result.handler_name = Array.isArray(result.handler_name)
        ? result.handler_name.map((item: any) => this.transform(item, childContext))
        : this.transform(result.handler_name, childContext);
    }
    
    return { CreateAccessMethodStmt: result };
  }

  GrantStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with GrantStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'GrantStmt']
    };
    
    if (result.objects !== undefined) {
      result.objects = Array.isArray(result.objects)
        ? result.objects.map((item: any) => this.transform(item, childContext))
        : this.transform(result.objects, childContext);
    }
    
    if (result.grantees !== undefined) {
      result.grantees = Array.isArray(result.grantees)
        ? result.grantees.map((item: any) => this.transform(item, childContext))
        : this.transform(result.grantees, childContext);
    }
    
    if (result.privileges !== undefined) {
      result.privileges = Array.isArray(result.privileges)
        ? result.privileges.map((item: any) => this.transform(item, childContext))
        : this.transform(result.privileges, childContext);
    }
    
    return { GrantStmt: result };
  }

  RevokeStmt(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    
    // Create child context with RevokeStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'RevokeStmt']
    };
    
    if (result.objects !== undefined) {
      result.objects = Array.isArray(result.objects)
        ? result.objects.map((item: any) => this.transform(item, childContext))
        : this.transform(result.objects, childContext);
    }
    
    if (result.grantees !== undefined) {
      result.grantees = Array.isArray(result.grantees)
        ? result.grantees.map((item: any) => this.transform(item, childContext))
        : this.transform(result.grantees, childContext);
    }
    
    if (result.privileges !== undefined) {
      result.privileges = Array.isArray(result.privileges)
        ? result.privileges.map((item: any) => this.transform(item, childContext))
        : this.transform(result.privileges, childContext);
    }
    
    return { RevokeStmt: result };
  }

  ResTarget(node: PG13.ResTarget, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.indirection !== undefined) {
      result.indirection = Array.isArray(node.indirection)
        ? node.indirection.map(item => this.transform(item as any, context))
        : this.transform(node.indirection as any, context);
    }
    
    if (node.val !== undefined) {
      result.val = this.transform(node.val as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { ResTarget: result };
  }

  private getFunctionName(funcCall: any): string | null {
    if (funcCall.funcname && Array.isArray(funcCall.funcname)) {
      const lastName = funcCall.funcname[funcCall.funcname.length - 1];
      if (lastName && typeof lastName === 'object' && 'String' in lastName) {
        return lastName.String.str || lastName.String.sval;
      }
    }
    return null;
  }

  private isOperatorName(objname: any): boolean {
    if (!objname || !Array.isArray(objname) || objname.length === 0) {
      return false;
    }
    
    const firstElement = objname[0];
    if (!firstElement || typeof firstElement !== 'object' || !('String' in firstElement)) {
      return false;
    }
    
    const name = firstElement.String?.str;
    if (!name || typeof name !== 'string') {
      return false;
    }
    
    // Check if it's an operator symbol (contains operator characters)
    const operatorChars = /[+\-*/<>=!~@#%^&|`?]/;
    return operatorChars.test(name);
  }

  private getFuncformatValue(node: any, context: TransformerContext): string {
    const funcname = this.getFunctionName(node);
    
    if (!funcname) {
      return 'COERCE_EXPLICIT_CALL';
    }
    
    if (funcname.toLowerCase() === 'substring') {
      return 'COERCE_SQL_SYNTAX';
    }
    
    const explicitCallFunctions = [
      'substr', 'timestamptz', 'timestamp', 'date', 'time', 'timetz',
      'interval', 'numeric', 'decimal', 'float4', 'float8', 'int2', 'int4', 'int8',
      'bool', 'text', 'varchar', 'char', 'bpchar'
    ];
    
    const sqlSyntaxFunctions = [
      'btrim', 'trim', 'ltrim', 'rtrim',
      'position', 'overlay',
      'extract', 'timezone', 'xmlexists',
      'current_date', 'current_time', 'current_timestamp',
      'localtime', 'localtimestamp', 'overlaps'
    ];
    
    if (explicitCallFunctions.includes(funcname.toLowerCase())) {
      return 'COERCE_EXPLICIT_CALL';
    }
    
    if (sqlSyntaxFunctions.includes(funcname.toLowerCase())) {
      return 'COERCE_SQL_SYNTAX';
    }
    
    return 'COERCE_EXPLICIT_CALL';
  }



  FunctionParameter(node: PG13.FunctionParameter, context: TransformerContext): any {
    const result: any = {};
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.argType !== undefined) {
      result.argType = this.transform(node.argType as any, context);
    }
    
    if (node.defexpr !== undefined) {
      result.defexpr = this.transform(node.defexpr as any, context);
    }
    
    if (node.mode !== undefined) {
      result.mode = node.mode === "FUNC_PARAM_IN" ? "FUNC_PARAM_DEFAULT" : node.mode;
    }
    
    return { FunctionParameter: result };
  }

  AlterFunctionStmt(node: PG13.AlterFunctionStmt, context: TransformerContext): any {
    const result: any = {};
    
    // Create child context with AlterFunctionStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'AlterFunctionStmt']
    };
    
    if (node.objtype !== undefined) {
      result.objtype = node.objtype;
    }
    
    if (node.func !== undefined) {
      // Handle plain object func (not wrapped in ObjectWithArgs)
      if (typeof node.func === 'object' && !('ObjectWithArgs' in node.func) && 'objargs' in node.func) {
        const funcResult: any = {};
        
        if ((node.func as any).objname !== undefined) {
          funcResult.objname = this.transform((node.func as any).objname, childContext);
        }
        
        if ((node.func as any).objargs !== undefined) {
          funcResult.objargs = this.transform((node.func as any).objargs, childContext);
          
          // Create objfuncargs from objargs for PG14
          funcResult.objfuncargs = Array.isArray((node.func as any).objargs)
            ? (node.func as any).objargs.map((arg: any) => this.createFunctionParameterFromTypeName(arg))
            : [this.createFunctionParameterFromTypeName((node.func as any).objargs)];
        }
        
        result.func = funcResult;
      } else {
        const funcResult = this.transform(node.func as any, childContext);
        result.func = funcResult;
      }
    }
    
    if (node.actions !== undefined) {
      result.actions = Array.isArray(node.actions)
        ? node.actions.map(item => this.transform(item as any, context))
        : this.transform(node.actions as any, context);
    }
    
    return { AlterFunctionStmt: result };
  }

  AlterOwnerStmt(node: PG13.AlterOwnerStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.objectType !== undefined) {
      result.objectType = node.objectType;
    }
    
    if (node.object !== undefined) {
      const childContext = {
        ...context,
        alterOwnerObjectType: node.objectType
      };
      
      const transformedObject = this.transform(node.object as any, childContext);
      
      if (node.objectType === 'OBJECT_FUNCTION' && transformedObject && 
          typeof transformedObject === 'object' && 'ObjectWithArgs' in transformedObject) {
        const objWithArgs = transformedObject.ObjectWithArgs;
        

      }
      
      result.object = transformedObject;
    }
    
    if (node.newowner !== undefined) {
      result.newowner = this.transform(node.newowner as any, context);
    }
    
    return { AlterOwnerStmt: result };
  }

  AlterTableStmt(node: PG13.AlterTableStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if ('relkind' in result) {
      result.objtype = result.relkind;
      delete result.relkind;
    }
    
    if (result.relation !== undefined) {
      result.relation = this.transform(result.relation as any, context);
    }
    
    if (result.cmds !== undefined) {
      result.cmds = Array.isArray(result.cmds)
        ? result.cmds.map((item: any) => this.transform(item as any, context))
        : this.transform(result.cmds as any, context);
    }
    
    return { AlterTableStmt: result };
  }

  CreateTableAsStmt(node: PG13.CreateTableAsStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if ('relkind' in result) {
      result.objtype = result.relkind;
      delete result.relkind;
    }
    
    if (result.query !== undefined) {
      result.query = this.transform(result.query as any, context);
    }
    
    if (result.into !== undefined) {
      result.into = this.transform(result.into as any, context);
    }
    
    return { CreateTableAsStmt: result };
  }

  RawStmt(node: PG13.RawStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.stmt !== undefined) {
      result.stmt = this.transform(node.stmt, context);
    }
    
    if (node.stmt_location !== undefined) {
      result.stmt_location = node.stmt_location;
    }
    
    if (node.stmt_len !== undefined) {
      result.stmt_len = node.stmt_len;
    }
    
    return { RawStmt: result };
  }

  SelectStmt(node: PG13.SelectStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.distinctClause !== undefined) {
      result.distinctClause = Array.isArray(node.distinctClause)
        ? node.distinctClause.map(item => this.transform(item, context))
        : this.transform(node.distinctClause, context);
    }
    
    if (node.intoClause !== undefined) {
      result.intoClause = this.transform(node.intoClause as any, context);
    }
    
    if (node.targetList !== undefined) {
      result.targetList = Array.isArray(node.targetList)
        ? node.targetList.map(item => this.transform(item, context))
        : this.transform(node.targetList, context);
    }
    
    if (node.fromClause !== undefined) {
      result.fromClause = Array.isArray(node.fromClause)
        ? node.fromClause.map(item => this.transform(item, context))
        : this.transform(node.fromClause, context);
    }
    
    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause, context);
    }
    
    if (node.groupClause !== undefined) {
      result.groupClause = Array.isArray(node.groupClause)
        ? node.groupClause.map(item => this.transform(item, context))
        : this.transform(node.groupClause, context);
    }
    
    if (node.havingClause !== undefined) {
      result.havingClause = this.transform(node.havingClause, context);
    }
    
    if (node.windowClause !== undefined) {
      result.windowClause = Array.isArray(node.windowClause)
        ? node.windowClause.map(item => this.transform(item, context))
        : this.transform(node.windowClause, context);
    }
    
    if (node.valuesLists !== undefined) {
      result.valuesLists = Array.isArray(node.valuesLists)
        ? node.valuesLists.map(item => this.transform(item, context))
        : this.transform(node.valuesLists, context);
    }
    
    if (node.sortClause !== undefined) {
      result.sortClause = Array.isArray(node.sortClause)
        ? node.sortClause.map(item => this.transform(item, context))
        : this.transform(node.sortClause, context);
    }
    
    if (node.limitOffset !== undefined) {
      result.limitOffset = this.transform(node.limitOffset, context);
    }
    
    if (node.limitCount !== undefined) {
      result.limitCount = this.transform(node.limitCount, context);
    }
    
    if (node.limitOption !== undefined) {
      result.limitOption = node.limitOption;
    }
    
    if (node.lockingClause !== undefined) {
      result.lockingClause = Array.isArray(node.lockingClause)
        ? node.lockingClause.map(item => this.transform(item, context))
        : this.transform(node.lockingClause, context);
    }
    
    if (node.withClause !== undefined) {
      // Handle WithClause transformation directly here since the method dispatch isn't working
      const withClause = node.withClause as any;
      
      if (withClause && typeof withClause === 'object' && withClause.ctes !== undefined) {
        const transformedWithClause: any = { ...withClause };
        
        if (typeof withClause.ctes === 'object' && withClause.ctes !== null && !Array.isArray(withClause.ctes)) {
          const cteArray = Object.keys(withClause.ctes)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => this.transform((withClause.ctes as any)[key], context));
          transformedWithClause.ctes = cteArray;
        } else if (Array.isArray(withClause.ctes)) {
          transformedWithClause.ctes = withClause.ctes.map((item: any) => this.transform(item as any, context));
        } else {
          transformedWithClause.ctes = this.transform(withClause.ctes as any, context);
        }
        
        if (withClause.recursive !== undefined) {
          transformedWithClause.recursive = withClause.recursive;
        }
        
        if (withClause.location !== undefined) {
          transformedWithClause.location = withClause.location;
        }
        
        result.withClause = transformedWithClause;
      } else {
        result.withClause = this.transform(node.withClause as any, context);
      }
    }
    
    if (node.op !== undefined) {
      result.op = node.op;
    }
    
    if (node.all !== undefined) {
      result.all = node.all;
    }
    
    if (node.larg !== undefined) {
      result.larg = this.transform(node.larg as any, context);
    }
    
    if (node.rarg !== undefined) {
      result.rarg = this.transform(node.rarg as any, context);
    }
    

    
    return { SelectStmt: result };
  }

  RangeSubselect(node: PG13.RangeSubselect, context: TransformerContext): any {
    const result: any = {};
    
    if (node.lateral !== undefined) {
      result.lateral = node.lateral;
    }
    
    if (node.subquery !== undefined) {
      result.subquery = this.transform(node.subquery, context);
    }
    
    if (node.alias !== undefined) {
      result.alias = node.alias;
    }
    
    return { RangeSubselect: result };
  }

  CommonTableExpr(node: PG13.CommonTableExpr, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.ctename !== undefined) {
      result.ctename = node.ctename;
    }
    
    if (node.aliascolnames !== undefined) {
      result.aliascolnames = Array.isArray(node.aliascolnames)
        ? node.aliascolnames.map(item => this.transform(item as any, context))
        : this.transform(node.aliascolnames as any, context);
    }
    
    if (node.ctematerialized !== undefined) {
      result.ctematerialized = node.ctematerialized;
    }
    
    if (node.ctequery !== undefined) {
      const nodeType = this.getNodeType(node.ctequery as any);
      const nodeData = this.getNodeData(node.ctequery as any);
      
      if (nodeType === 'SelectStmt' && typeof this.SelectStmt === 'function') {
        result.ctequery = this.SelectStmt(nodeData, context);
      } else {
        result.ctequery = this.transform(node.ctequery as any, context);
      }
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    if (node.cterecursive !== undefined) {
      result.cterecursive = node.cterecursive;
    }
    
    if (node.cterefcount !== undefined) {
      result.cterefcount = node.cterefcount;
    }
    
    if (node.ctecolnames !== undefined) {
      result.ctecolnames = Array.isArray(node.ctecolnames)
        ? node.ctecolnames.map(item => this.transform(item as any, context))
        : this.transform(node.ctecolnames as any, context);
    }
    
    if (node.ctecoltypes !== undefined) {
      result.ctecoltypes = Array.isArray(node.ctecoltypes)
        ? node.ctecoltypes.map(item => this.transform(item as any, context))
        : this.transform(node.ctecoltypes as any, context);
    }
    
    if (node.ctecoltypmods !== undefined) {
      result.ctecoltypmods = Array.isArray(node.ctecoltypmods)
        ? node.ctecoltypmods.map(item => this.transform(item as any, context))
        : this.transform(node.ctecoltypmods as any, context);
    }
    
    if (node.ctecolcollations !== undefined) {
      result.ctecolcollations = Array.isArray(node.ctecolcollations)
        ? node.ctecolcollations.map(item => this.transform(item as any, context))
        : this.transform(node.ctecolcollations as any, context);
    }
    
    return { CommonTableExpr: result };
  }

  SubLink(node: PG13.SubLink, context: TransformerContext): any {
    const result: any = {};
    
    if (node.xpr !== undefined) {
      result.xpr = this.transform(node.xpr, context);
    }
    
    if (node.subLinkType !== undefined) {
      result.subLinkType = node.subLinkType;
    }
    
    if (node.subLinkId !== undefined) {
      result.subLinkId = node.subLinkId;
    }
    
    if (node.testexpr !== undefined) {
      result.testexpr = this.transform(node.testexpr, context);
    }
    
    if (node.operName !== undefined) {
      result.operName = node.operName.map(item => this.transform(item, context));
    }
    
    if (node.subselect !== undefined) {
      result.subselect = this.transform(node.subselect, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { SubLink: result };
  }

  CopyStmt(node: PG13.CopyStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    
    if (node.query !== undefined) {
      result.query = this.transform(node.query as any, context);
    }
    
    if (node.attlist !== undefined) {
      result.attlist = Array.isArray(node.attlist)
        ? node.attlist.map(item => this.transform(item as any, context))
        : this.transform(node.attlist as any, context);
    }
    
    if (node.is_from !== undefined) {
      result.is_from = node.is_from;
    }
    
    if (node.is_program !== undefined) {
      result.is_program = node.is_program;
    }
    
    if (node.filename !== undefined) {
      result.filename = node.filename;
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.whereClause !== undefined) {
      result.whereClause = this.transform(node.whereClause as any, context);
    }
    
    return { CopyStmt: result };
  }

  CreateEnumStmt(node: PG13.CreateEnumStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.typeName !== undefined) {
      result.typeName = Array.isArray(node.typeName)
        ? node.typeName.map(item => this.transform(item as any, context))
        : this.transform(node.typeName as any, context);
    }
    
    if (node.vals !== undefined) {
      result.vals = Array.isArray(node.vals)
        ? node.vals.map(item => this.transform(item as any, context))
        : this.transform(node.vals as any, context);
    }
    
    return { CreateEnumStmt: result };
  }

  DefineStmt(node: PG13.DefineStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.kind !== undefined) {
      result.kind = node.kind;
    }
    
    if (node.oldstyle !== undefined) {
      result.oldstyle = node.oldstyle;
    }
    
    if (node.defnames !== undefined) {
      result.defnames = Array.isArray(node.defnames)
        ? node.defnames.map(item => this.transform(item as any, context))
        : this.transform(node.defnames as any, context);
    }
    
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    
    if (node.definition !== undefined) {
      result.definition = Array.isArray(node.definition)
        ? node.definition.map(item => this.transform(item as any, context))
        : this.transform(node.definition as any, context);
    }
    
    if (node.if_not_exists !== undefined) {
      result.if_not_exists = node.if_not_exists;
    }
    
    if (node.replace !== undefined) {
      result.replace = node.replace;
    }
    
    return { DefineStmt: result };
  }

  DoStmt(node: PG13.DoStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.args !== undefined) {
      result.args = Array.isArray(node.args)
        ? node.args.map(item => this.transform(item as any, context))
        : this.transform(node.args as any, context);
    }
    
    return { DoStmt: result };
  }

  DeclareCursorStmt(node: PG13.DeclareCursorStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.portalname !== undefined) {
      result.portalname = node.portalname;
    }
    
    if (node.options === undefined) {
      result.options = 0;
    } else {
      if (node.options === 48) {
        result.options = 288;
      } else {
        result.options = (node.options & ~32) | 256;
      }
    }
    
    if (node.query !== undefined) {
      result.query = this.transform(node.query as any, context);
    }
    
    return { DeclareCursorStmt: result };
  }

  VacuumStmt(node: PG13.VacuumStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.rels !== undefined) {
      result.rels = Array.isArray(node.rels)
        ? node.rels.map(item => this.transform(item as any, context))
        : this.transform(node.rels as any, context);
    }
    
    if (node.is_vacuumcmd !== undefined) {
      result.is_vacuumcmd = node.is_vacuumcmd;
    }
    
    return { VacuumStmt: result };
  }

  VacuumRelation(node: PG13.VacuumRelation, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = node.relation;
    }
    
    if (node.va_cols !== undefined) {
      result.va_cols = Array.isArray(node.va_cols)
        ? node.va_cols.map(item => this.transform(item as any, context))
        : this.transform(node.va_cols as any, context);
    }
    
    return { VacuumRelation: result };
  }

  RangeVar(node: PG13.RangeVar, context: TransformerContext): any {
    const result: any = {};
    
    if (node.catalogname !== undefined) {
      result.catalogname = node.catalogname;
    }
    
    if (node.schemaname !== undefined) {
      result.schemaname = node.schemaname;
    }
    
    if (node.relname !== undefined) {
      result.relname = node.relname;
    }
    
    // Handle PG13->PG14 inh field transformation
    if (node.inh !== undefined) {
      result.inh = node.inh;
    }
    
    if (node.relpersistence !== undefined) {
      result.relpersistence = node.relpersistence;
    }
    
    if (node.alias !== undefined) {
      result.alias = this.transform(node.alias as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { RangeVar: result };
  }

  IntoClause(node: PG13.IntoClause, context: TransformerContext): any {
    const result: any = {};
    
    if (node.rel !== undefined) {
      result.rel = node.rel;
    }
    
    if (node.colNames !== undefined) {
      result.colNames = Array.isArray(node.colNames)
        ? node.colNames.map(item => this.transform(item as any, context))
        : this.transform(node.colNames as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.onCommit !== undefined) {
      result.onCommit = node.onCommit;
    }
    
    if (node.tableSpaceName !== undefined) {
      result.tableSpaceName = node.tableSpaceName;
    }
    
    if (node.viewQuery !== undefined) {
      result.viewQuery = this.transform(node.viewQuery as any, context);
    }
    
    if (node.skipData !== undefined) {
      result.skipData = node.skipData;
    }
    
    return { IntoClause: result };
  }

  CreateCastStmt(node: PG13.CreateCastStmt, context: TransformerContext): any {
    const result: any = {};
    
    if (node.sourcetype !== undefined) {
      result.sourcetype = this.transform(node.sourcetype as any, context);
    }
    
    if (node.targettype !== undefined) {
      result.targettype = this.transform(node.targettype as any, context);
    }
    
    if (node.func !== undefined) {
      const childContext: TransformerContext = {
        ...context,
        parentNodeTypes: [...(context.parentNodeTypes || []), 'CreateCastStmt']
      };
      const wrappedFunc = { ObjectWithArgs: node.func };
      const transformedFunc = this.transform(wrappedFunc as any, childContext);
      result.func = transformedFunc.ObjectWithArgs;
    }
    
    if (node.context !== undefined) {
      result.context = node.context;
    }
    
    if (node.inout !== undefined) {
      result.inout = node.inout;
    }
    
    return { CreateCastStmt: result };
  }

  CreateFunctionStmt(node: PG13.CreateFunctionStmt, context: TransformerContext): any {
    const result: any = { ...node };
    
    if (node.funcname !== undefined) {
      result.funcname = Array.isArray(node.funcname)
        ? node.funcname.map(item => this.transform(item as any, context))
        : this.transform(node.funcname as any, context);
    }
    
    if (node.parameters !== undefined) {
      result.parameters = Array.isArray(node.parameters)
        ? node.parameters.map(item => this.transform(item as any, context))
        : this.transform(node.parameters as any, context);
    }
    
    if (node.returnType !== undefined) {
      result.returnType = this.transform(node.returnType as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map(item => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    return { CreateFunctionStmt: result };
  }

  TableLikeClause(node: PG13.TableLikeClause, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = this.transformTableLikeOptions(node.options);
    }
    
    return { TableLikeClause: result };
  }

  private transformTableLikeOptions(options: any): any {
    // Handle TableLikeOption enum changes from PG13 to PG14
    
    if (typeof options === 'string') {
      return options;
    }
    
    if (typeof options === 'number') {
      // Handle bitwise combination of TableLikeOption flags
      let transformedOptions = 0;
      
      for (let bit = 0; bit < 32; bit++) {
        if (options & (1 << bit)) {
          let pg14Bit = bit;
          
          if (bit >= 1) {
            pg14Bit = bit + 1;
          }
          
          transformedOptions |= (1 << pg14Bit);
        }
      }
      
      return transformedOptions;
    }
    
    return options;
  }

  ObjectWithArgs(node: PG13.ObjectWithArgs, context: TransformerContext): any {
    const result: any = { ...node };

    if (result.objname !== undefined) {
      if (Array.isArray(result.objname)) {
        result.objname = result.objname.map((item: any) => this.transform(item, context));
      } else if (typeof result.objname === 'object' && result.objname !== null) {
        const keys = Object.keys(result.objname);
        const isNumericKeysObject = keys.every(k => /^\d+$/.test(k));
        
        if (isNumericKeysObject && keys.length > 0) {
          // Check if we should preserve objname as object with numeric keys
          const shouldPreserve = this.shouldPreserveObjnameAsObject(context);
          if (shouldPreserve) {
            const transformedObjname: any = {};
            Object.keys(result.objname).forEach(k => {
              transformedObjname[k] = this.transform(result.objname[k], context);
            });
            result.objname = transformedObjname;
          } else {
            const sortedKeys = keys.sort((a, b) => parseInt(a) - parseInt(b));
            result.objname = sortedKeys.map(key => this.transform(result.objname[key], context));
          }
        }else {
          // Regular object transformation
          result.objname = this.transform(result.objname, context);
        }
      } else {
        result.objname = this.transform(result.objname, context);
      }
    }
    
    if (result.objargs !== undefined) {
      result.objargs = Array.isArray(result.objargs)
        ? result.objargs.map((item: any) => this.transform(item, context))
        : [this.transform(result.objargs, context)];
    }
    
    // Handle objfuncargs based on context
    const shouldCreateObjfuncargs = this.shouldCreateObjfuncargs(context);
    const shouldPreserveObjfuncargs = this.shouldPreserveObjfuncargs(context);
    const shouldCreateObjfuncargsFromObjargs = this.shouldCreateObjfuncargsFromObjargs(context);
    
    // Debug logging for AlterFunctionStmt context
    if (context.parentNodeTypes && context.parentNodeTypes.includes('AlterFunctionStmt')) {
      console.log('DEBUG AlterFunctionStmt ObjectWithArgs:', {
        shouldCreateObjfuncargs,
        shouldPreserveObjfuncargs,
        shouldCreateObjfuncargsFromObjargs,
        hasObjargs: !!result.objargs,
        hasObjfuncargs: !!result.objfuncargs,
        parentNodeTypes: context.parentNodeTypes
      });
    }
    
    if (shouldCreateObjfuncargsFromObjargs && result.objargs) {
      // Create objfuncargs from objargs (this takes priority over shouldCreateObjfuncargs)
      if (context.parentNodeTypes && context.parentNodeTypes.includes('AlterFunctionStmt')) {
        console.log('DEBUG AlterFunctionStmt: CREATING objfuncargs from objargs');
      }
      
      result.objfuncargs = Array.isArray(result.objargs)
        ? result.objargs.map((arg: any) => this.createFunctionParameterFromTypeName(arg))
        : [this.createFunctionParameterFromTypeName(result.objargs)];
      
    } else if (shouldCreateObjfuncargs) {
      if (context.parentNodeTypes && context.parentNodeTypes.includes('AlterFunctionStmt')) {
        console.log('DEBUG AlterFunctionStmt: CREATING empty objfuncargs');
      }
      result.objfuncargs = [];
    } else if (result.objfuncargs !== undefined) {
      if (shouldPreserveObjfuncargs) {
        if (context.parentNodeTypes && context.parentNodeTypes.includes('AlterFunctionStmt')) {
          console.log('DEBUG AlterFunctionStmt: PRESERVING objfuncargs');
        }
        result.objfuncargs = Array.isArray(result.objfuncargs)
          ? result.objfuncargs.map((item: any) => this.transform(item, context))
          : [this.transform(result.objfuncargs, context)];
      } else {
        if (context.parentNodeTypes && context.parentNodeTypes.includes('AlterFunctionStmt')) {
          console.log('DEBUG AlterFunctionStmt: DELETING objfuncargs because shouldPreserveObjfuncargs is false');
        }
        delete result.objfuncargs;
      }
    } else if (!shouldPreserveObjfuncargs) {
      delete result.objfuncargs;
    }
    
    return { ObjectWithArgs: result };
  }

  private shouldCreateObjfuncargs(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    for (const parentType of context.parentNodeTypes) {
      // if (parentType === 'SomeSpecificContext') {
      //   return true;
      // }
    }
    
    return false;
  }

  private shouldPreserveObjfuncargs(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    const excludedNodeTypes = [
      'CreateOpClassStmt', 'CreateAggregateStmt', 'AlterAggregateStmt',
      'CreateFunctionStmt', 'CreateStmt', 'CreateTypeStmt', 'CreateOpFamilyStmt',
      'CreateOperatorStmt'
    ];
    
    const path = context.path || [];
    for (const node of path) {
      if (node && typeof node === 'object') {
        const nodeType = Object.keys(node)[0];
        if (excludedNodeTypes.includes(nodeType)) {
          return false;
        }
      }
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (excludedNodeTypes.includes(parentType)) {
        return false;
      }
      if (parentType === 'DropStmt') {
        return false;
      }
    }
    
    const allowedNodeTypes = [
      'CommentStmt', 'AlterFunctionStmt', 'AlterOwnerStmt', 'RenameStmt', 'AlterObjectSchemaStmt', 'CreateCastStmt', 'AlterOpFamilyStmt'
    ];
    
    for (const node of path) {
      if (node && typeof node === 'object') {
        const nodeType = Object.keys(node)[0];
        if (allowedNodeTypes.includes(nodeType)) {
          return true;
        }
      }
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (allowedNodeTypes.includes(parentType)) {
        return true;
      }
    }
    
    return false;
  }

  private shouldCreateObjfuncargsFromObjargs(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    if ((context as any).commentObjtype === 'OBJECT_OPERATOR' && 
        context.parentNodeTypes.includes('CommentStmt')) {
      return false;
    }
    
    
    // Check if this is an operator context - operators should NOT get objfuncargs
    const path = context.path || [];
    
    // Check if we're in any statement with OBJECT_OPERATOR
    if ((context as any).alterOwnerObjectType === 'OBJECT_OPERATOR' ||
        (context as any).alterObjectSchemaObjectType === 'OBJECT_OPERATOR' ||
        (context as any).renameObjectType === 'OBJECT_OPERATOR') {
      return false;
    }
    for (const node of path) {
      if (node && typeof node === 'object') {
        const nodeData = Object.values(node)[0] as any;
        if (nodeData && (nodeData.objtype === 'OBJECT_OPERATOR' || 
                         nodeData.objectType === 'OBJECT_OPERATOR' ||
                         nodeData.renameType === 'OBJECT_OPERATOR')) {
          return false;
        }
        if (nodeData && nodeData.objname && Array.isArray(nodeData.objname)) {
          // Check if objname contains operator symbols - but only if it's actually an operator context
          const objnameStr = nodeData.objname.map((item: any) => {
            if (item && typeof item === 'object' && item.String && item.String.str) {
              return item.String.str;
            }
            return '';
          }).join('');
          if (objnameStr.match(/^[@#~!%^&*+=<>?|-]+$/) && 
              (nodeData.objtype === 'OBJECT_OPERATOR' || 
               nodeData.objectType === 'OBJECT_OPERATOR' ||
               nodeData.renameType === 'OBJECT_OPERATOR')) {
            return false;
          }
        }
      }
    }
    
    const excludedNodeTypes = [
      'CreateOpClassStmt', 'CreateAggregateStmt', 'AlterAggregateStmt',
      'CreateFunctionStmt', 'CreateStmt', 'CreateTypeStmt', 'CreateOpFamilyStmt',
      'CreateOperatorStmt'
    ];
    
    for (const node of path) {
      if (node && typeof node === 'object') {
        const nodeType = Object.keys(node)[0];
        if (excludedNodeTypes.includes(nodeType)) {
          return false;
        }
      }
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (excludedNodeTypes.includes(parentType)) {
        return false;
      }
    }
    
    const allowedNodeTypes = [
      'CommentStmt', 'AlterFunctionStmt', 'RenameStmt', 'AlterOwnerStmt', 'AlterObjectSchemaStmt', 'CreateCastStmt', 'AlterOpFamilyStmt', 'CreateOpClassItem', 'GrantStmt', 'RevokeStmt'
    ];
    
    for (const node of path) {
      if (node && typeof node === 'object') {
        const nodeType = Object.keys(node)[0];
        if (allowedNodeTypes.includes(nodeType)) {
          return true;
        }
        if (nodeType === 'DropStmt') {
          return this.shouldAddObjfuncargsForDropStmt(context);
        }
      }
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (allowedNodeTypes.includes(parentType)) {
        return true;
      }
      if (parentType === 'DropStmt') {
        return this.shouldAddObjfuncargsForDropStmt(context);
      }
    }
    
    return false;
  }

  private shouldAddObjfuncargsForDropStmt(context: TransformerContext): boolean {
    const path = context.path || [];
    for (const node of path) {
      if (node && typeof node === 'object' && 'DropStmt' in node) {
        const dropStmt = node.DropStmt;
        if (dropStmt && dropStmt.removeType === 'OBJECT_OPERATOR') {
          return false;
        }
        if (dropStmt && (dropStmt.removeType === 'OBJECT_FUNCTION' || 
                        dropStmt.removeType === 'OBJECT_AGGREGATE' ||
                        dropStmt.removeType === 'OBJECT_PROCEDURE')) {
          return true;
        }
      }
    }
    
    if ((context as any).dropRemoveType) {
      const removeType = (context as any).dropRemoveType;
      if (removeType === 'OBJECT_OPERATOR') {
        return false;
      }
      if (removeType === 'OBJECT_FUNCTION' || 
          removeType === 'OBJECT_AGGREGATE' ||
          removeType === 'OBJECT_PROCEDURE') {
        return true;
      }
    }
    
    return false;
  }

  private shouldPreserveObjnameAsObject(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false; // Default to converting to arrays for PG14
    }
    
    // For CreateOpClassItem contexts, convert objname to arrays (PG14 expects arrays)
    const convertToArrayContexts = [
      'CreateOpClassStmt', 'CreateOpClassItem', 'CreateAccessMethodStmt'
    ];
    
    for (const parentType of context.parentNodeTypes) {
      if (convertToArrayContexts.includes(parentType)) {
        return false; // Convert to array for these contexts (PG14 format)
      }
    }
    
    return true; // Preserve as object for other contexts
  }

  private createFunctionParameterFromTypeName(typeNameNode: any, context?: TransformerContext): any {
    const transformedTypeName = this.transform(typeNameNode, { parentNodeTypes: [] });
    
    const argType = transformedTypeName.TypeName ? transformedTypeName.TypeName : transformedTypeName;
    
    const functionParam: any = {
      argType: argType,
      mode: "FUNC_PARAM_DEFAULT"
    };
    
    if (context && context.parentNodeTypes && !context.parentNodeTypes.includes('DropStmt')) {
      // Only add name if we have one and we're not in a DropStmt context
      if (typeNameNode && typeNameNode.name) {
        functionParam.name = typeNameNode.name;
      }
    }
    
    return {
      FunctionParameter: functionParam
    };
  }

  private isVariadicAggregateContext(context: TransformerContext): boolean {
    let parent = context.parent;
    while (parent) {
      if (parent.currentNode && typeof parent.currentNode === 'object') {
        if ('RenameStmt' in parent.currentNode) {
          const renameStmt = parent.currentNode.RenameStmt;
          return renameStmt?.renameType === 'OBJECT_AGGREGATE';
        }
        if ('CreateAggregateStmt' in parent.currentNode || 
            'AlterAggregateStmt' in parent.currentNode) {
          return true;
        }
      }
      parent = parent.parent;
    }
    return false;
  }

  private transformA_Expr_Kind(kind: string): string {
    const pg13ToP14Map: { [key: string]: string } = {
      'AEXPR_OP': 'AEXPR_OP',
      'AEXPR_OP_ANY': 'AEXPR_OP_ANY', 
      'AEXPR_OP_ALL': 'AEXPR_OP_ALL',
      'AEXPR_DISTINCT': 'AEXPR_DISTINCT',
      'AEXPR_NOT_DISTINCT': 'AEXPR_NOT_DISTINCT',
      'AEXPR_NULLIF': 'AEXPR_NULLIF',
      'AEXPR_OF': 'AEXPR_IN', // AEXPR_OF removed, map to AEXPR_IN
      'AEXPR_IN': 'AEXPR_IN',
      'AEXPR_LIKE': 'AEXPR_LIKE',
      'AEXPR_ILIKE': 'AEXPR_ILIKE',
      'AEXPR_SIMILAR': 'AEXPR_SIMILAR',
      'AEXPR_BETWEEN': 'AEXPR_BETWEEN',
      'AEXPR_NOT_BETWEEN': 'AEXPR_NOT_BETWEEN',
      'AEXPR_BETWEEN_SYM': 'AEXPR_BETWEEN_SYM',
      'AEXPR_NOT_BETWEEN_SYM': 'AEXPR_NOT_BETWEEN_SYM',
      'AEXPR_PAREN': 'AEXPR_OP' // AEXPR_PAREN removed, map to AEXPR_OP
    };
    
    return pg13ToP14Map[kind] || kind;
  }

  private transformRoleSpecType(type: string): string {
    const pg13ToP14Map: { [key: string]: string } = {
      'ROLESPEC_CSTRING': 'ROLESPEC_CSTRING',
      'ROLESPEC_CURRENT_USER': 'ROLESPEC_CURRENT_USER',
      'ROLESPEC_SESSION_USER': 'ROLESPEC_SESSION_USER', 
      'ROLESPEC_PUBLIC': 'ROLESPEC_PUBLIC'
    };
    
    return pg13ToP14Map[type] || type;
  }

  private isVariadicParameterContext(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (parentType === 'CreateAggregateStmt' || 
          parentType === 'AlterAggregateStmt') {
        return true;
      }
    }
    
    return false;
  }

  private isCreateFunctionContext(context: TransformerContext): boolean {
    if (!context.parentNodeTypes || context.parentNodeTypes.length === 0) {
      return false;
    }
    
    for (const parentType of context.parentNodeTypes) {
      if (parentType === 'CreateFunctionStmt') {
        return true;
      }
    }
    
    return false;
  }

  String(node: PG13.String, context: TransformerContext): any {
    const result: any = { ...node };
    return { String: result };
  }

  BitString(node: PG13.BitString, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { BitString: result };
  }

  Float(node: PG13.Float, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { Float: result };
  }

  Integer(node: PG13.Integer, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { Integer: result };
  }

  Null(node: PG13.Null, context: TransformerContext): any {
    const result: any = { ...node };
    
    return { Null: result };
  }

  List(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.items !== undefined) {
      result.items = Array.isArray(node.items)
        ? node.items.map((item: any) => this.transform(item as any, context))
        : this.transform(node.items as any, context);
    }
    
    return { List: result };
  }

  A_Expr(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.kind !== undefined) {
      if (node.kind === "AEXPR_OF") {
        result.kind = "AEXPR_IN";
      } else if (node.kind === "AEXPR_PAREN") {
        result.kind = "AEXPR_OP";
      } else {
        result.kind = node.kind;
      }
    }
    
    if (node.name !== undefined) {
      result.name = Array.isArray(node.name)
        ? node.name.map((item: any) => this.transform(item as any, context))
        : this.transform(node.name as any, context);
    }
    
    if (node.lexpr !== undefined) {
      result.lexpr = this.transform(node.lexpr as any, context);
    }
    
    if (node.rexpr !== undefined) {
      result.rexpr = this.transform(node.rexpr as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    if (node.kind !== undefined) {
      result.kind = this.transformA_Expr_Kind(node.kind);
    }
    
    return { A_Expr: result };
  }

  RoleSpec(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.roletype !== undefined) {
      result.roletype = this.transformRoleSpecType(node.roletype);
    }
    
    if (node.rolename !== undefined) {
      result.rolename = node.rolename;
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { RoleSpec: result };
  }


  AlterTableCmd(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.subtype !== undefined) {
      result.subtype = node.subtype;
    }
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.num !== undefined) {
      result.num = node.num;
    }
    
    if (node.newowner !== undefined) {
      result.newowner = this.transform(node.newowner as any, context);
    }
    
    if (node.def !== undefined) {
      result.def = this.transform(node.def as any, context);
    }
    
    if (node.behavior !== undefined) {
      result.behavior = node.behavior;
    }
    
    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }
    
    return { AlterTableCmd: result };
  }

  TypeName(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.names !== undefined) {
      result.names = Array.isArray(node.names)
        ? node.names.map((item: any) => this.transform(item as any, context))
        : this.transform(node.names as any, context);
    }
    
    if (node.typeOid !== undefined) {
      result.typeOid = node.typeOid;
    }
    
    if (node.setof !== undefined) {
      result.setof = node.setof;
    }
    
    if (node.pct_type !== undefined) {
      result.pct_type = node.pct_type;
    }
    
    if (node.typmods !== undefined) {
      result.typmods = Array.isArray(node.typmods)
        ? node.typmods.map((item: any) => this.transform(item as any, context))
        : this.transform(node.typmods as any, context);
    }
    
    if (node.typemod !== undefined) {
      result.typemod = node.typemod;
    }
    
    if (node.arrayBounds !== undefined) {
      result.arrayBounds = Array.isArray(node.arrayBounds)
        ? node.arrayBounds.map((item: any) => this.transform(item as any, context))
        : this.transform(node.arrayBounds as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { TypeName: result };
  }

  ColumnRef(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.fields !== undefined) {
      result.fields = Array.isArray(node.fields)
        ? node.fields.map((item: any) => this.transform(item as any, context))
        : this.transform(node.fields as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { ColumnRef: result };
  }

  A_Const(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.val !== undefined) {
      result.val = this.transform(node.val as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { A_Const: result };
  }

  A_Star(node: any, context: TransformerContext): any {
    const result: any = { ...node };
    return { A_Star: result };
  }

  SortBy(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.node !== undefined) {
      result.node = this.transform(node.node as any, context);
    }
    
    if (node.sortby_dir !== undefined) {
      result.sortby_dir = node.sortby_dir;
    }
    
    if (node.sortby_nulls !== undefined) {
      result.sortby_nulls = node.sortby_nulls;
    }
    
    if (node.useOp !== undefined) {
      result.useOp = Array.isArray(node.useOp)
        ? node.useOp.map((item: any) => this.transform(item as any, context))
        : this.transform(node.useOp as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { SortBy: result };
  }

  CreateDomainStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    // Create child context with CreateDomainStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'CreateDomainStmt']
    };
    
    if (node.domainname !== undefined) {
      result.domainname = Array.isArray(node.domainname)
        ? node.domainname.map((item: any) => this.transform(item as any, context))
        : this.transform(node.domainname as any, context);
    }
    
    if (node.typeName !== undefined) {
      result.typeName = this.transform(node.typeName as any, context);
    }
    
    if (node.collClause !== undefined) {
      result.collClause = this.transform(node.collClause as any, context);
    }
    
    if (node.constraints !== undefined) {
      result.constraints = Array.isArray(node.constraints)
        ? node.constraints.map((item: any) => this.transform(item as any, childContext))
        : this.transform(node.constraints as any, childContext);
    }
    
    return { CreateDomainStmt: result };
  }

  CreateSeqStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.sequence !== undefined) {
      result.sequence = this.transform(node.sequence as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map((item: any) => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.ownerId !== undefined) {
      result.ownerId = node.ownerId;
    }
    
    if (node.for_identity !== undefined) {
      result.for_identity = node.for_identity;
    }
    
    if (node.if_not_exists !== undefined) {
      result.if_not_exists = node.if_not_exists;
    }
    
    return { CreateSeqStmt: result };
  }

  WithClause(node: PG13.WithClause, context: TransformerContext): any {
    console.log('WithClause called with:', {
      ctes: node.ctes,
      ctesType: typeof node.ctes,
      isArray: Array.isArray(node.ctes),
      keys: node.ctes ? Object.keys(node.ctes) : null
    });
    
    const result: any = { ...node };
    
    if (node.ctes !== undefined) {
      const shouldConvertToArray = this.shouldConvertCTEsToArray(context);
      console.log('shouldConvertToArray:', shouldConvertToArray);
      
      if (typeof node.ctes === 'object' && node.ctes !== null && !Array.isArray(node.ctes)) {
        console.log('Converting object to array, shouldConvertToArray:', shouldConvertToArray);
        if (shouldConvertToArray) {
          const cteArray = Object.keys(node.ctes)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(key => this.transform((node.ctes as any)[key], context));
          console.log('Converted to array:', cteArray);
          result.ctes = cteArray;
        } else {
          console.log('Keeping as object');
          const transformedCtes: any = {};
          Object.keys(node.ctes).forEach(key => {
            transformedCtes[key] = this.transform((node.ctes as any)[key], context);
          });
          result.ctes = transformedCtes;
        }
      } else if (Array.isArray(node.ctes)) {
        console.log('Input is already array, transforming items');
        result.ctes = node.ctes.map(item => this.transform(item as any, context));
      } else {
        console.log('Input is neither object nor array, transforming directly');
        result.ctes = this.transform(node.ctes as any, context);
      }
    }
    
    if (node.recursive !== undefined) {
      result.recursive = node.recursive;
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { WithClause: result };
  }

  private shouldConvertCTEsToArray(context: TransformerContext): boolean {
    return true;
  }

  AlterSeqStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.sequence !== undefined) {
      result.sequence = this.transform(node.sequence as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map((item: any) => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.for_identity !== undefined) {
      result.for_identity = node.for_identity;
    }
    
    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }
    
    return { AlterSeqStmt: result };
  }

  CTECycleClause(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.cycle_col_list !== undefined) {
      result.cycle_col_list = Array.isArray(node.cycle_col_list)
        ? node.cycle_col_list.map((item: any) => this.transform(item as any, context))
        : this.transform(node.cycle_col_list as any, context);
    }
    
    if (node.cycle_mark_column !== undefined) {
      result.cycle_mark_column = node.cycle_mark_column;
    }
    
    if (node.cycle_mark_value !== undefined) {
      result.cycle_mark_value = this.transform(node.cycle_mark_value as any, context);
    }
    
    if (node.cycle_mark_default !== undefined) {
      result.cycle_mark_default = this.transform(node.cycle_mark_default as any, context);
    }
    
    if (node.cycle_path_column !== undefined) {
      result.cycle_path_column = node.cycle_path_column;
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { CTECycleClause: result };
  }

  CTESearchClause(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.search_col_list !== undefined) {
      result.search_col_list = Array.isArray(node.search_col_list)
        ? node.search_col_list.map((item: any) => this.transform(item as any, context))
        : this.transform(node.search_col_list as any, context);
    }
    
    if (node.search_breadth_first !== undefined) {
      result.search_breadth_first = node.search_breadth_first;
    }
    
    if (node.search_seq_column !== undefined) {
      result.search_seq_column = node.search_seq_column;
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { CTESearchClause: result };
  }

  PLAssignStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.indirection !== undefined) {
      result.indirection = Array.isArray(node.indirection)
        ? node.indirection.map((item: any) => this.transform(item as any, context))
        : this.transform(node.indirection as any, context);
    }
    
    if (node.nnames !== undefined) {
      result.nnames = node.nnames;
    }
    
    if (node.val !== undefined) {
      result.val = this.transform(node.val as any, context);
    }
    
    if (node.location !== undefined) {
      result.location = node.location;
    }
    
    return { PLAssignStmt: result };
  }

  ReturnStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.returnval !== undefined) {
      result.returnval = this.transform(node.returnval as any, context);
    }
    
    return { ReturnStmt: result };
  }

  StatsElem(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.name !== undefined) {
      result.name = node.name;
    }
    
    if (node.expr !== undefined) {
      result.expr = this.transform(node.expr as any, context);
    }
    
    return { StatsElem: result };
  }

  CreateStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, context);
    }
    
    if (node.tableElts !== undefined) {
      result.tableElts = Array.isArray(node.tableElts)
        ? node.tableElts.map((item: any) => this.transform(item as any, context))
        : this.transform(node.tableElts as any, context);
    }
    
    if (node.inhRelations !== undefined) {
      result.inhRelations = Array.isArray(node.inhRelations)
        ? node.inhRelations.map((item: any) => this.transform(item as any, context))
        : this.transform(node.inhRelations as any, context);
    }
    
    if (node.partbound !== undefined) {
      result.partbound = this.transform(node.partbound as any, context);
    }
    
    if (node.partspec !== undefined) {
      result.partspec = this.transform(node.partspec as any, context);
    }
    
    if (node.ofTypename !== undefined) {
      result.ofTypename = this.transform(node.ofTypename as any, context);
    }
    
    if (node.constraints !== undefined) {
      result.constraints = Array.isArray(node.constraints)
        ? node.constraints.map((item: any) => this.transform(item as any, context))
        : this.transform(node.constraints as any, context);
    }
    
    if (node.options !== undefined) {
      result.options = Array.isArray(node.options)
        ? node.options.map((item: any) => this.transform(item as any, context))
        : this.transform(node.options as any, context);
    }
    
    if (node.oncommit !== undefined) {
      result.oncommit = node.oncommit;
    }
    
    if (node.tablespacename !== undefined) {
      result.tablespacename = node.tablespacename;
    }
    
    if (node.accessMethod !== undefined) {
      result.accessMethod = node.accessMethod;
    }
    
    if (node.if_not_exists !== undefined) {
      result.if_not_exists = node.if_not_exists;
    }
    
    return { CreateStmt: result };
  }

  CreatePolicyStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    if (node.policy_name !== undefined) {
      result.policy_name = node.policy_name;
    }
    
    if (node.table !== undefined) {
      result.table = this.transform(node.table as any, context);
    }
    
    if (node.cmd_name !== undefined) {
      result.cmd_name = node.cmd_name;
    }
    
    if (node.permissive !== undefined) {
      result.permissive = node.permissive;
    }
    
    if (node.roles !== undefined) {
      result.roles = Array.isArray(node.roles)
        ? node.roles.map((item: any) => this.transform(item as any, context))
        : this.transform(node.roles as any, context);
    }
    
    if (node.qual !== undefined) {
      result.qual = this.transform(node.qual as any, context);
    }
    
    if (node.with_check !== undefined) {
      result.with_check = this.transform(node.with_check as any, context);
    }
    
    return { CreatePolicyStmt: result };
  }

  RenameStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    // Create child context with RenameStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'RenameStmt'],
      renameObjectType: node.renameType
    };
    
    if (node.renameType !== undefined) {
      result.renameType = node.renameType;
    }
    
    if (node.relationType !== undefined) {
      result.relationType = node.relationType;
    }
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, childContext);
    }
    
    if (node.object !== undefined) {
      result.object = this.transform(node.object as any, childContext);
    }
    
    if (node.subname !== undefined) {
      result.subname = node.subname;
    }
    
    if (node.newname !== undefined) {
      result.newname = node.newname;
    }
    
    if (node.behavior !== undefined) {
      result.behavior = node.behavior;
    }
    
    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }
    
    return { RenameStmt: result };
  }

  AlterObjectSchemaStmt(node: any, context: TransformerContext): any {
    const result: any = {};
    
    // Create child context with AlterObjectSchemaStmt as parent
    const childContext: TransformerContext = {
      ...context,
      parentNodeTypes: [...(context.parentNodeTypes || []), 'AlterObjectSchemaStmt'],
      alterObjectSchemaObjectType: node.objectType
    };
    
    if (node.objectType !== undefined) {
      result.objectType = node.objectType;
    }
    
    if (node.relation !== undefined) {
      result.relation = this.transform(node.relation as any, childContext);
    }
    
    if (node.object !== undefined) {
      result.object = this.transform(node.object as any, childContext);
    }
    
    if (node.newschema !== undefined) {
      result.newschema = node.newschema;
    }
    
    if (node.missing_ok !== undefined) {
      result.missing_ok = node.missing_ok;
    }
    
    return { AlterObjectSchemaStmt: result };
  }

}
