import { BaseVisitor, DeparserContext } from './base';
import { Node, TypeName, Alias, RangeVar } from '@pgsql/types';
import { QuoteUtils } from '../utils/quote-utils';
import { ListUtils } from '../utils/list-utils';
import { SqlFormatter } from '../utils/sql-formatter';

export class TypeVisitor extends BaseVisitor {
  private formatter: SqlFormatter;
  private expressionVisitor: any;
  private deparser?: any;

  constructor(formatter: SqlFormatter, expressionVisitor: any, deparser?: any) {
    super();
    this.formatter = formatter;
    this.expressionVisitor = expressionVisitor;
    this.deparser = deparser;
  }

  visit(node: Node, context: DeparserContext = {}): string {
    const nodeType = this.getNodeType(node);
    const nodeData = this.getNodeData(node);

    switch (nodeType) {
      case 'TypeName':
        return this.TypeName(nodeData, context);
      case 'Alias':
        return this.Alias(nodeData, context);
      case 'RangeVar':
        return this.RangeVar(nodeData, context);
      default:
        throw new Error(`Type visitor does not handle node type: ${nodeType}`);
    }
  }

  private TypeName(node: TypeName, context: DeparserContext): string {
    const names = ListUtils.unwrapList(node.names);
    const catalogAndType = names.map(name => {
      if (this.deparser) {
        return this.deparser.deparse(name, context);
      }
      return this.visit(name, context);
    });
    const catalog = catalogAndType[0];
    const type = catalogAndType[1];

    const args = node.typmods ? this.formatTypeMods(node.typmods, context) : null;

    const mods = (name: string, size: string | null) => {
      if (size != null) {
        return `${name}(${size})`;
      }
      return name;
    };

    if (catalog === 'char' && !type) {
      return mods('"char"', args);
    }
    
    if (catalog === 'pg_catalog' && type === 'char') {
      return mods('pg_catalog."char"', args);
    }

    if (catalog !== 'pg_catalog') {
      const quotedNames = names.map(name => {
        const nameStr = this.deparser ? this.deparser.deparse(name, context) : this.visit(name, context);
        return QuoteUtils.quote(nameStr);
      });
      return mods(quotedNames.join('.'), args);
    }

    const pgTypeName = this.getPgCatalogTypeName(type, args);
    return mods(pgTypeName, args);
  }

  private Alias(node: Alias, context: DeparserContext): string {
    const name = node.aliasname;
    const output: string[] = ['AS'];

    if (node.colnames) {
      const colnames = ListUtils.unwrapList(node.colnames);
      const quotedColnames = colnames.map(col => {
        const colStr = this.deparser ? this.deparser.deparse(col, context) : this.visit(col, context);
        return QuoteUtils.quote(colStr);
      });
      output.push(QuoteUtils.quote(name) + this.formatter.parens(quotedColnames.join(', ')));
    } else {
      output.push(QuoteUtils.quote(name));
    }

    return output.join(' ');
  }

  private RangeVar(node: RangeVar, context: DeparserContext): string {
    const output: string[] = [];

    if (node.schemaname) {
      output.push(QuoteUtils.quote(node.schemaname));
      output.push('.');
    }

    output.push(QuoteUtils.quote(node.relname));

    if (node.alias) {
      const aliasStr = this.deparser ? this.deparser.deparse(node.alias, context) : this.visit(node.alias, context);
      output.push(aliasStr);
    }

    return output.join(' ');
  }



  private formatTypeMods(typmods: Node[], context: DeparserContext): string | null {
    if (!typmods || typmods.length === 0) {
      return null;
    }

    const mods = ListUtils.unwrapList(typmods);
    return mods.map(mod => {
      return this.deparser ? this.deparser.deparse(mod, context) : this.visit(mod, context);
    }).join(', ');
  }

  private getPgCatalogTypeName(typeName: string, size: string | null): string {
    switch (typeName) {
      case 'bpchar':
        if (size != null) {
          return 'char';
        }
        return 'pg_catalog.bpchar';
      case 'varchar':
        return 'varchar';
      case 'numeric':
        return 'numeric';
      case 'bool':
        return 'boolean';
      case 'int2':
        return 'smallint';
      case 'int4':
        return 'int';
      case 'int8':
        return 'bigint';
      case 'real':
        return 'pg_catalog.float4';
      case 'time':
        return 'time';
      case 'timestamp':
        return 'timestamp';
      case 'interval':
        return 'interval';
      case 'bit':
        return 'bit';
      default:
        return `pg_catalog.${typeName}`;
    }
  }
}
