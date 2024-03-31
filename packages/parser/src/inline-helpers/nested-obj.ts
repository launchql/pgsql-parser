export const nestedObjCode = `
export default {
    get<T>(obj: Record<string, any>, path: string): T | undefined {
      const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
      let result: any = obj;
      for (const key of keys) {
        if (result == null) {
          return undefined;
        }
        result = result[key];
      }
      return result as T;
    },
  
    set(obj: Record<string, any>, path: string, value: any): void {
      if (value === undefined) {
        return;
      }
  
      const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      current[keys[keys.length - 1]] = value;
    },
  
    has(obj: Record<string, any>, path: string): boolean {
      const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
      let current = obj;
      for (const key of keys) {
        if (current == null || !(key in current)) {
          return false;
        }
        current = current[key];
      }
      return true;
    }
  };
  
`;