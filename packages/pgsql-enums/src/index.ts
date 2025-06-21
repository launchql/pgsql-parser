import toInt from './enums2int';
import toStr from './enums2str';
import nodes from './nodes';

export { toInt, toStr, nodes };
export const getEnum = (enumType, key) => {
  if (typeof key === 'number') {
    return toStr[enumType][key];
  } else {
    return toInt[enumType][key];
  }
};

export * from './types';
