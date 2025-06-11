import { Node } from '@pgsql/types';

export class ListUtils {
  static unwrapList(obj: any): any[] {
    if (obj === undefined || obj === null) {
      return [];
    }
    
    if (obj.List !== undefined) {
      return obj.List.items || [];
    }
    
    if (Array.isArray(obj)) {
      return obj;
    }
    
    return [obj];
  }

  static formatList(items: any[], separator: string = ', ', prefix: string = '', formatter: (item: any) => string): string {
    if (!items || items.length === 0) {
      return '';
    }

    return items
      .map(item => `${prefix}${formatter(item)}`)
      .join(separator);
  }
}
