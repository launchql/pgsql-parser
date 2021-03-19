import toInt from './enum.2int.json';
import toStr from './enum.2str.json';
import nodes from './nodes.json';

export { toInt, toStr, nodes };
export const getEnum = (enumType, key) => {
  if (typeof key === 'number') {
    return toStr[enumType][key];
  } else {
    return toInt[enumType][key];
  }
};

export * from './types';
