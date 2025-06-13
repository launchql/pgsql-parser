import { BaseVisitor, DeparserContext } from './base';
import { Node, CreateStmt, DropStmt, AlterTableStmt, IndexStmt, ViewStmt, CreateFunctionStmt, TruncateStmt, CommentStmt, DefineStmt, CompositeTypeStmt, RenameStmt, AlterOwnerStmt, AlterObjectSchemaStmt, DoStmt, VariableSetStmt, VariableShowStmt, ExplainStmt, CreateTrigStmt } from '@pgsql/types';
import { QuoteUtils } from '../utils/quote-utils';
import { ListUtils } from '../utils/list-utils';
import { SqlFormatter } from '../utils/sql-formatter';

export class UtilityVisitor extends BaseVisitor {
  private formatter: SqlFormatter;
  private expressionVisitor: any;
  private typeVisitor: any;
  private deparser?: any;

  constructor(formatter: SqlFormatter, expressionVisitor: any, typeVisitor: any, deparser?: any) {
    super();
    this.formatter = formatter;
    this.expressionVisitor = expressionVisitor;
    this.typeVisitor = typeVisitor;
    this.deparser = deparser;
  }

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    switch (nodeType) {
      case 'CreateStmt':
        return this.CreateStmt(nodeData, context);
      case 'DropStmt':
        return this.DropStmt(nodeData, context);
      case 'AlterTableStmt':
        return this.AlterTableStmt(nodeData, context);
      case 'IndexStmt':
        return this.IndexStmt(nodeData, context);
      case 'ViewStmt':
        return this.ViewStmt(nodeData, context);
      case 'CreateFunctionStmt':
        return this.CreateFunctionStmt(nodeData, context);
      case 'TruncateStmt':
        return this.TruncateStmt(nodeData, context);
      case 'CommentStmt':
        return this.CommentStmt(nodeData, context);
      case 'DefineStmt':
        return this.DefineStmt(nodeData, context);
      case 'CompositeTypeStmt':
        return this.CompositeTypeStmt(nodeData, context);
      case 'RenameStmt':
        return this.RenameStmt(nodeData, context);
      case 'AlterOwnerStmt':
        return this.AlterOwnerStmt(nodeData, context);
      case 'AlterObjectSchemaStmt':
        return this.AlterObjectSchemaStmt(nodeData, context);
      case 'DoStmt':
        return this.DoStmt(nodeData, context);
      case 'VariableSetStmt':
        return this.VariableSetStmt(nodeData, context);
      case 'VariableShowStmt':
        return this.VariableShowStmt(nodeData, context);
      case 'ExplainStmt':
        return this.ExplainStmt(nodeData, context);
      case 'CreateTrigStmt':
        return this.CreateTrigStmt(nodeData, context);
      case 'ColumnDef':
        return this.ColumnDef(nodeData, context);
      case 'Constraint':
        return this.Constraint(nodeData, context);
      default:
        throw new Error(`Utility visitor does not handle node type: ${nodeType}`);
    }
  }

  private CreateStmt(node: CreateStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.if_not_exists) {
      output.push('TABLE IF NOT EXISTS');
    } else {
      output.push('TABLE');
    }

    output.push(this.typeVisitor.visit(node.relation, context));

    if (node.tableElts) {
      const elements = ListUtils.unwrapList(node.tableElts);
      const elementStrs = elements.map(el => {
        if (this.deparser) {
          return this.deparser.deparse(el, context);
        }
        return this.expressionVisitor.visit(el, context);
      });
      output.push(this.formatter.parens(elementStrs.join(', ')));
    }

    if (node.inhRelations) {
      output.push('INHERITS');
      const inherits = ListUtils.unwrapList(node.inhRelations);
      const inheritStrs = inherits.map(rel => this.typeVisitor.visit(rel, context));
      output.push(this.formatter.parens(inheritStrs.join(', ')));
    }

    return output.join(' ');
  }

  private DropStmt(node: DropStmt, context: DeparserContext): string {
    const output: string[] = ['DROP'];

    output.push(this.getObjectTypeName(node.removeType as string));

    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    const objects = ListUtils.unwrapList(node.objects);
    const objectStrs = objects.map(obj => {
      if (Array.isArray(obj)) {
        return obj.map(o => QuoteUtils.quote(this.expressionVisitor.visit(o, context))).join('.');
      }
      return this.expressionVisitor.visit(obj, context);
    });
    output.push(objectStrs.join(', '));

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  private AlterTableStmt(node: AlterTableStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER TABLE'];

    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    output.push(this.typeVisitor.visit(node.relation, context));

    if (node.cmds) {
      const cmds = ListUtils.unwrapList(node.cmds);
      const cmdStrs = cmds.map(cmd => this.expressionVisitor.visit(cmd, context));
      output.push(cmdStrs.join(', '));
    }

    return output.join(' ');
  }

  private IndexStmt(node: IndexStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.unique) {
      output.push('UNIQUE');
    }

    output.push('INDEX');

    if (node.concurrent) {
      output.push('CONCURRENTLY');
    }

    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }

    if (node.idxname) {
      output.push(QuoteUtils.quote(node.idxname));
    }

    output.push('ON');
    output.push(this.typeVisitor.visit(node.relation, context));

    if (node.indexParams) {
      const params = ListUtils.unwrapList(node.indexParams);
      const paramStrs = params.map(param => this.expressionVisitor.visit(param, context));
      output.push(this.formatter.parens(paramStrs.join(', ')));
    }

    if (node.whereClause) {
      output.push('WHERE');
      output.push(this.expressionVisitor.visit(node.whereClause, context));
    }

    return output.join(' ');
  }

  private ViewStmt(node: ViewStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.replace) {
      output.push('OR REPLACE');
    }

    output.push('VIEW');
    output.push(this.typeVisitor.visit(node.view, context));

    if (node.aliases) {
      const aliases = ListUtils.unwrapList(node.aliases);
      const aliasStrs = aliases.map(alias => QuoteUtils.quote(this.expressionVisitor.visit(alias, context)));
      output.push(this.formatter.parens(aliasStrs.join(', ')));
    }

    output.push('AS');
    output.push(this.expressionVisitor.visit(node.query, context));

    return output.join(' ');
  }

  private CreateFunctionStmt(node: CreateFunctionStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    if (node.replace) {
      output.push('OR REPLACE');
    }

    output.push('FUNCTION');

    const funcname = ListUtils.unwrapList(node.funcname);
    const funcnameStr = funcname.map(name => QuoteUtils.quote(this.expressionVisitor.visit(name, context))).join('.');
    output.push(funcnameStr);

    if (node.parameters) {
      const params = ListUtils.unwrapList(node.parameters);
      const paramStrs = params.map(param => this.expressionVisitor.visit(param, context));
      output.push(this.formatter.parens(paramStrs.join(', ')));
    } else {
      output.push('()');
    }

    if (node.returnType) {
      output.push('RETURNS');
      output.push(this.typeVisitor.visit(node.returnType, context));
    }

    if (node.options) {
      const options = ListUtils.unwrapList(node.options);
      const optionStrs = options.map(opt => this.expressionVisitor.visit(opt, context));
      output.push(...optionStrs);
    }

    return output.join(' ');
  }

  private TruncateStmt(node: TruncateStmt, context: DeparserContext): string {
    const output: string[] = ['TRUNCATE'];

    if (node.relations) {
      const relations = ListUtils.unwrapList(node.relations);
      const relationStrs = relations.map(rel => this.typeVisitor.visit(rel, context));
      output.push(relationStrs.join(', '));
    }

    if (node.restart_seqs) {
      output.push('RESTART IDENTITY');
    }

    if (node.behavior === 'DROP_CASCADE') {
      output.push('CASCADE');
    }

    return output.join(' ');
  }

  private CommentStmt(node: CommentStmt, context: DeparserContext): string {
    const output: string[] = ['COMMENT ON'];

    output.push(this.getObjectTypeName(node.objtype as string));
    output.push(this.expressionVisitor.visit(node.object, context));
    output.push('IS');

    if (node.comment) {
      output.push(QuoteUtils.escape(node.comment));
    } else {
      output.push('NULL');
    }

    return output.join(' ');
  }

  private DefineStmt(node: DefineStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE'];

    output.push(this.getObjectTypeName(node.kind as string));

    if (node.if_not_exists) {
      output.push('IF NOT EXISTS');
    }

    const defnames = ListUtils.unwrapList(node.defnames);
    const defnameStrs = defnames.map(name => QuoteUtils.quote(this.expressionVisitor.visit(name, context)));
    output.push(defnameStrs.join('.'));

    if (node.definition) {
      const defs = ListUtils.unwrapList(node.definition);
      const defStrs = defs.map(def => this.expressionVisitor.visit(def, context));
      output.push(this.formatter.parens(defStrs.join(', ')));
    }

    return output.join(' ');
  }

  private CompositeTypeStmt(node: CompositeTypeStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE TYPE'];

    output.push(this.typeVisitor.visit(node.typevar, context));
    output.push('AS');

    if (node.coldeflist) {
      const coldefs = ListUtils.unwrapList(node.coldeflist);
      const coldefStrs = coldefs.map(coldef => this.expressionVisitor.visit(coldef, context));
      output.push(this.formatter.parens(coldefStrs.join(', ')));
    }

    return output.join(' ');
  }

  private RenameStmt(node: RenameStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];

    output.push(this.getObjectTypeName(node.renameType as string));

    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    if (node.relation) {
      output.push(this.typeVisitor.visit(node.relation, context));
    } else if (node.object) {
      output.push(this.expressionVisitor.visit(node.object, context));
    }

    output.push('RENAME TO');
    output.push(QuoteUtils.quote(node.newname));

    return output.join(' ');
  }

  private AlterOwnerStmt(node: AlterOwnerStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];

    output.push(this.getObjectTypeName(node.objectType as string));
    output.push(this.expressionVisitor.visit(node.object, context));
    output.push('OWNER TO');
    output.push(this.expressionVisitor.visit(node.newowner, context));

    return output.join(' ');
  }

  private AlterObjectSchemaStmt(node: AlterObjectSchemaStmt, context: DeparserContext): string {
    const output: string[] = ['ALTER'];

    output.push(this.getObjectTypeName(node.objectType as string));

    if (node.missing_ok) {
      output.push('IF EXISTS');
    }

    output.push(this.expressionVisitor.visit(node.object, context));
    output.push('SET SCHEMA');
    output.push(QuoteUtils.quote(node.newschema));

    return output.join(' ');
  }

  private DoStmt(node: DoStmt, context: DeparserContext): string {
    const output: string[] = ['DO'];

    if (node.args) {
      const args = ListUtils.unwrapList(node.args);
      const argStrs = args.map(arg => this.expressionVisitor.visit(arg, context));
      output.push(argStrs.join(' '));
    }

    return output.join(' ');
  }

  private VariableSetStmt(node: VariableSetStmt, context: DeparserContext): string {
    const output: string[] = ['SET'];

    if (node.name) {
      output.push(QuoteUtils.quote(node.name));
    }

    if (node.args) {
      output.push('TO');
      const args = ListUtils.unwrapList(node.args);
      const argStrs = args.map(arg => this.expressionVisitor.visit(arg, context));
      output.push(argStrs.join(', '));
    }

    return output.join(' ');
  }

  private VariableShowStmt(node: VariableShowStmt, context: DeparserContext): string {
    const output: string[] = ['SHOW'];

    if (node.name) {
      output.push(QuoteUtils.quote(node.name));
    }

    return output.join(' ');
  }

  private ExplainStmt(node: ExplainStmt, context: DeparserContext): string {
    const output: string[] = ['EXPLAIN'];

    if (node.options) {
      const options = ListUtils.unwrapList(node.options);
      const optionStrs = options.map(opt => this.expressionVisitor.visit(opt, context));
      output.push(this.formatter.parens(optionStrs.join(', ')));
    }

    output.push(this.expressionVisitor.visit(node.query, context));

    return output.join(' ');
  }

  private CreateTrigStmt(node: CreateTrigStmt, context: DeparserContext): string {
    const output: string[] = ['CREATE TRIGGER'];

    output.push(QuoteUtils.quote(node.trigname));
    output.push('ON');
    output.push(this.typeVisitor.visit(node.relation, context));

    if (node.funcname) {
      output.push('EXECUTE PROCEDURE');
      const funcname = ListUtils.unwrapList(node.funcname);
      const funcnameStr = funcname.map(name => QuoteUtils.quote(this.expressionVisitor.visit(name, context))).join('.');
      output.push(funcnameStr + '()');
    }

    return output.join(' ');
  }

  private ColumnDef(node: any, context: DeparserContext): string {
    const output: string[] = [];

    if (node.colname) {
      output.push(QuoteUtils.quote(node.colname));
    }

    if (node.typeName) {
      output.push(this.typeVisitor.visit(node.typeName, context));
    }

    if (node.constraints) {
      const constraints = ListUtils.unwrapList(node.constraints);
      const constraintStrs = constraints.map(constraint => {
        if (this.deparser) {
          return this.deparser.deparse(constraint, context);
        }
        return this.expressionVisitor.visit(constraint, context);
      });
      output.push(...constraintStrs);
    }

    if (node.raw_default) {
      output.push('DEFAULT');
      output.push(this.expressionVisitor.visit(node.raw_default, context));
    }

    if (node.is_not_null) {
      output.push('NOT NULL');
    }

    return output.join(' ');
  }

  private Constraint(node: any, context: DeparserContext): string {
    const output: string[] = [];

    switch (node.contype) {
      case 'CONSTR_PRIMARY':
        output.push('PRIMARY KEY');
        break;
      case 'CONSTR_UNIQUE':
        output.push('UNIQUE');
        break;
      case 'CONSTR_CHECK':
        output.push('CHECK');
        if (node.raw_expr) {
          output.push('(');
          output.push(this.expressionVisitor.visit(node.raw_expr, context));
          output.push(')');
        }
        break;
      case 'CONSTR_NOT_NULL':
        output.push('NOT NULL');
        break;
      case 'CONSTR_NULL':
        output.push('NULL');
        break;
      case 'CONSTR_DEFAULT':
        output.push('DEFAULT');
        if (node.raw_expr) {
          output.push(this.expressionVisitor.visit(node.raw_expr, context));
        }
        break;
      case 'CONSTR_FOREIGN':
        output.push('FOREIGN KEY');
        if (node.fk_attrs) {
          const attrs = ListUtils.unwrapList(node.fk_attrs);
          const attrStrs = attrs.map(attr => QuoteUtils.quote(this.expressionVisitor.visit(attr, context)));
          output.push('(' + attrStrs.join(', ') + ')');
        }
        if (node.pktable) {
          output.push('REFERENCES');
          output.push(this.expressionVisitor.visit(node.pktable, context));
          if (node.pk_attrs) {
            const pkAttrs = ListUtils.unwrapList(node.pk_attrs);
            const pkAttrStrs = pkAttrs.map(attr => QuoteUtils.quote(this.expressionVisitor.visit(attr, context)));
            output.push('(' + pkAttrStrs.join(', ') + ')');
          }
        }
        break;
      default:
        throw new Error(`Unknown constraint type: ${node.contype}`);
    }

    if (node.conname) {
      return `CONSTRAINT ${QuoteUtils.quote(node.conname)} ${output.join(' ')}`;
    }

    return output.join(' ');
  }

  private getObjectTypeName(objType: string): string {
    switch (objType) {
      case 'OBJECT_TABLE':
        return 'TABLE';
      case 'OBJECT_INDEX':
        return 'INDEX';
      case 'OBJECT_SEQUENCE':
        return 'SEQUENCE';
      case 'OBJECT_VIEW':
        return 'VIEW';
      case 'OBJECT_MATVIEW':
        return 'MATERIALIZED VIEW';
      case 'OBJECT_FUNCTION':
        return 'FUNCTION';
      case 'OBJECT_TRIGGER':
        return 'TRIGGER';
      case 'OBJECT_SCHEMA':
        return 'SCHEMA';
      case 'OBJECT_DATABASE':
        return 'DATABASE';
      case 'OBJECT_ROLE':
        return 'ROLE';
      case 'OBJECT_TYPE':
        return 'TYPE';
      case 'OBJECT_DOMAIN':
        return 'DOMAIN';
      case 'OBJECT_EXTENSION':
        return 'EXTENSION';
      case 'OBJECT_FDW':
        return 'FOREIGN DATA WRAPPER';
      case 'OBJECT_FOREIGN_SERVER':
        return 'SERVER';
      case 'OBJECT_FOREIGN_TABLE':
        return 'FOREIGN TABLE';
      case 'OBJECT_COLLATION':
        return 'COLLATION';
      case 'OBJECT_CONVERSION':
        return 'CONVERSION';
      case 'OBJECT_AGGREGATE':
        return 'AGGREGATE';
      case 'OBJECT_CAST':
        return 'CAST';
      case 'OBJECT_OPERATOR':
        return 'OPERATOR';
      case 'OBJECT_OPCLASS':
        return 'OPERATOR CLASS';
      case 'OBJECT_OPFAMILY':
        return 'OPERATOR FAMILY';
      case 'OBJECT_RULE':
        return 'RULE';
      case 'OBJECT_TSPARSER':
        return 'TEXT SEARCH PARSER';
      case 'OBJECT_TSDICT':
        return 'TEXT SEARCH DICTIONARY';
      case 'OBJECT_TSTEMPLATE':
        return 'TEXT SEARCH TEMPLATE';
      case 'OBJECT_TSCONFIG':
        return 'TEXT SEARCH CONFIGURATION';
      default:
        return 'UNKNOWN';
    }
  }
}
