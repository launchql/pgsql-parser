export const cleanLines = (sql) => {
  return sql
    .split('\n')
    .map((l) => l.trim())
    .filter((a) => a)
    .join('\n');
};

export const transform = (obj, props) => {
  let copy = null;
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

const noop = () => undefined;

export const cleanTree = (tree) => {
  return transform(tree, {
    stmt_len: noop,
    stmt_location: noop,
    location: noop,
    DefElem: (obj) => {
      if (obj.defname === 'as') {
        if (Array.isArray(obj.arg) && obj.arg.length) {
          // function
          obj.arg[0].String.str = obj.arg[0].String.str.trim();
        } else {
          // do stmt
          obj.arg.String.str = obj.arg.String.str.trim();
        }
        return cleanTree(obj);
      } else {
        return cleanTree(obj);
      }
    }
  });
};

export const cleanTreeWithStmt = (tree) => {
  return transform(tree, {
    stmt_location: noop,
    location: noop
  });
};
