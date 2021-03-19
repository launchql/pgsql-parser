const enums = require('./libpg_enums');
const structs = require('./libpg_structs');
const fs = require('fs');
const { getEnum } = require('../main');

let astNodes = {};
const getAstNodes = (which) => {
  const nodes = structs[which];
  astNodes = Object.keys(nodes).reduce((m, key) => {
    const obj = nodes[key].fields.reduce((m2, field) => {
      if (!field.name) {
        return m2;
      }
      const type = field.c_type.replace(/\*$/, '');
      let nested = false;
      let isEnum = false;
      if (structs[which].hasOwnProperty(type)) {
        nested = true;
      }
      if (enums[which].hasOwnProperty(type)) {
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
  }, astNodes);
};

const toInt = {};
const toStr = {};
const getEnums = (which) => {
  const nodes = enums[which];

  Object.keys(nodes).forEach((key) => {
    nodes[key].values.forEach((value, i) => {
      if (!value.name) return;

      let val;
      if (typeof value.value === 'undefined') {
        val = i - 1;
      } else {
        val = value.value;
      }

      toInt[key] = toInt[key] || {};
      toInt[key][value.name] = val;
      toStr[key] = toStr[key] || {};
      toStr[key][val] = value.name;
    });
  });
};

getEnums('nodes/primnodes');
getEnums('nodes/parsenodes');
getEnums('nodes/lockoptions');
getEnums('nodes/nodes');
getEnums('commands/vacuum');

getAstNodes('nodes/primnodes');
getAstNodes('nodes/parsenodes');
getAstNodes('nodes/lockoptions');
getAstNodes('commands/vacuum');

fs.writeFileSync(
  __dirname + '/../src/nodes.json',
  JSON.stringify(astNodes, null, 2)
);

fs.writeFileSync(
  __dirname + '/../src/enum.2str.json',
  JSON.stringify(toStr, null, 2)
);
fs.writeFileSync(
  __dirname + '/../src/enum.2int.json',
  JSON.stringify(toInt, null, 2)
);
