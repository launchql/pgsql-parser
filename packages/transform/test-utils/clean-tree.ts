/* eslint-disable no-restricted-syntax */

export const cleanLines = (sql: string) => {
    return sql
      .split('\n')
      .map((l) => l.trim())
      .filter((a) => a)
      .join('\n');
  };
  
  export const transform = (obj: any, props: any): any => {
    let copy: any = null;
    // Handle the 3 simple types, and null or undefined
    if (obj == null || typeof obj !== 'object') {
      return obj;
    }
  
    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
  
    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0, len = obj.length; i < len; i++) {
        copy[i] = transform(obj[i], props);
      }
      return copy;
    }
  
    // Handle Object
    if (obj instanceof Object || typeof obj === 'object') {
      copy = {};
      for (const attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          if (props.hasOwnProperty(attr)) {
            if (typeof props[attr] === 'function') {
              copy[attr] = props[attr](obj[attr]);
            } else if (props[attr].hasOwnProperty(obj[attr])) {
              copy[attr] = props[attr][obj[attr]];
            } else {
              copy[attr] = transform(obj[attr], props);
            }
          } else {
            copy[attr] = transform(obj[attr], props);
          }
        } else {
          copy[attr] = transform(obj[attr], props);
        }
      }
      return copy;
    }
  
    throw new Error("Unable to copy obj! Its type isn't supported.");
  };
  
  const noop = (): undefined => undefined;
  
  export const cleanTree = (tree: any) => {
    return transform(tree, {
      stmt_len: noop,
      stmt_location: noop,
      location: noop
    });
  };
  
  export const cleanTreeWithStmt = (tree: any) => {
    return transform(tree, {
      stmt_location: noop,
      location: noop
    });
  };
  