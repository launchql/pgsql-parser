import { BaseTransformer, TransformerContext } from '../visitors/base';
import { Node as PG16Node } from '../16/types';
import { Node as PG17Node } from '../17/types';

export class V16ToV17Transformer extends BaseTransformer {


  SelectStmt(node: any, context?: TransformerContext): any {
    const transformedData: any = { ...node };
    
    if (!('limitOption' in transformedData)) {
      transformedData.limitOption = "LIMIT_OPTION_DEFAULT";
    }
    if (!('op' in transformedData)) {
      transformedData.op = "SETOP_NONE";
    }
    
    for (const [key, value] of Object.entries(node)) {
      if (key === 'limitOption' || key === 'op') {
        continue;
      } else if (key === 'withClause' && value && typeof value === 'object') {
        transformedData[key] = { ...value };
        if (transformedData[key].ctes && Array.isArray(transformedData[key].ctes)) {
          transformedData[key].ctes = transformedData[key].ctes.map((cte: any) => this.transform(cte, context));
        }
      } else if (key === 'larg' || key === 'rarg') {
        if (value && typeof value === 'object') {
          transformedData[key] = this.SelectStmt(value, context);
        } else {
          transformedData[key] = value;
        }
      } else if (Array.isArray(value)) {
        transformedData[key] = value.map(item => this.transform(item, context));
      } else if (value && typeof value === 'object') {
        transformedData[key] = this.transform(value, context);
      } else {
        transformedData[key] = value;
      }
    }
    
    return transformedData;
  }
}
