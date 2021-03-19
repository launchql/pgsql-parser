/* eslint-disable no-restricted-syntax */

import { getEnum, nodes, toStr, toInt } from 'pgsql-enums';

const wrapRaw = (tree) => {
  return tree.stmts.map(({ stmt, stmt_len }) => {
    return {
      RawStmt: {
        stmt,
        stmt_len
      }
    };
  });
};

export const preparse = (tree) => {
  const stmts = wrapRaw(tree);
  return stmts.map((stmt) => transform2(stmt));
  //   return stmts.map((stmt) => stmt);
};

export const transform = (obj, context) => {
  let copy = null;
  // Handle null or undefined
  if (obj == null) {
    return obj;
  }

  // Handle the 3 simple types
  if (typeof obj !== 'object') {
    // if (context.enum) {
    //   return toInt[context.enum][obj];
    //   return obj;
    // } else {
    return obj;
    // }
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
      copy[i] = transform(obj[i], context);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object || typeof obj === 'object') {
    copy = {};

    for (const attr in obj) {
      // IF IS AST NODE
      if (nodes.hasOwnProperty(attr)) {
        context = { node: attr };
        copy[attr] = transform(obj[attr], context);
      } else {
        // MUST BE A FIELD
        if (context && context.node) {
          const attrSchema = nodes[context.node][attr];

          if (attrSchema?.enum) {
            copy[attr] = transform(obj[attr], {
              enum: attrSchema.type
            });
          } else if (nodes.hasOwnProperty(attrSchema?.type)) {
            if (attrSchema.type === 'Expr') {
              copy[attr] = transform(obj[attr], {
                node: attrSchema.type
              });
            } else {
              copy[attr] = {
                [attrSchema.type]: transform(obj[attr], {
                  node: attrSchema.type
                })
              };
            }
          } else {
            copy[attr] = transform(obj[attr], context);
          }
        } else {
          copy[attr] = transform(obj[attr], context);
        }
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

export const transform2 = (obj, context) => {
  let copy = null;
  // Handle null or undefined
  if (obj == null) {
    return obj;
  }

  // Handle the 3 simple types
  if (typeof obj !== 'object') {
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
      copy[i] = transform2(obj[i], context);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object || typeof obj === 'object') {
    copy = {};

    for (const attr in obj) {
      if (attr === 'List') {
        copy = [];
        for (let i = 0, len = obj[attr].items.length; i < len; i++) {
          copy[i] = transform2(obj[attr].items[i], context);
        }
      } else {
        copy[attr] = transform2(obj[attr], context);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};
