import enums from './libpg_enums';
import structs from './libpg_structs';

let astNodes;
export const getAstNodes = () => {
  if (astNodes) return astNodes;
  const nodes = structs['nodes/parsenodes'];
  astNodes = Object.keys(nodes).reduce((m, key) => {
    const obj = nodes[key].fields.reduce((m2, field) => {
      if (!field.name) {
        return m2;
      }
      const type = field.c_type.replace(/\*$/, '');
      let nested = false;
      let isEnum = false;
      if (structs['nodes/parsenodes'].hasOwnProperty(type)) {
        nested = true;
      }
      if (enums['nodes/parsenodes'].hasOwnProperty(type)) {
        isEnum = true;
      }
      m2[field.name] = {
        type
      };
      if (nested) m2[field.name].nested = nested;
      if (isEnum) m2[field.name].enum = isEnum;

      return m2;
    }, {});
    m[key] = obj;
    return m;
  }, {});
  return astNodes;
};
