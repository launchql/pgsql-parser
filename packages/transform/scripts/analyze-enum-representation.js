const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, '../../../__fixtures__/transform');

// Check if a value looks like an enum (all caps with underscores)
function isEnumValue(value) {
  return typeof value === 'string' && /^[A-Z][A-Z0-9_]*$/.test(value);
}

// Find all enum values in an object
function findEnumValues(obj, path = '') {
  const enums = [];
  
  if (obj === null || obj === undefined) return enums;
  
  if (typeof obj === 'string' && isEnumValue(obj)) {
    enums.push({ path, value: obj });
    return enums;
  }
  
  if (typeof obj === 'number' && path.includes('kind') || path.includes('type')) {
    // Might be an enum represented as number
    enums.push({ path, value: obj, isNumeric: true });
    return enums;
  }
  
  if (typeof obj !== 'object') return enums;
  
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      enums.push(...findEnumValues(item, `${path}[${i}]`));
    });
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      enums.push(...findEnumValues(value, newPath));
    });
  }
  
  return enums;
}

console.log('Enum Representation Analysis');
console.log('============================\n');

// Analyze ALTER TABLE for enum representations
const alterTableQuery = 'ALTER TABLE users ADD COLUMN email TEXT';
console.log(`Analyzing: ${alterTableQuery}\n`);

[13, 14, 15, 16, 17].forEach(version => {
  const data = JSON.parse(fs.readFileSync(path.join(fixturesDir, version.toString(), 'alter_table.json'), 'utf8'));
  const ast = data[0].ast;
  
  const enums = findEnumValues(ast);
  
  console.log(`Version ${version}:`);
  const enumsByPath = {};
  enums.forEach(e => {
    const simplePath = e.path.replace(/\[\d+\]/g, '[]').replace(/^stmts\[\]\.stmt\./, '');
    if (!enumsByPath[simplePath]) {
      enumsByPath[simplePath] = [];
    }
    enumsByPath[simplePath].push(e.value);
  });
  
  Object.entries(enumsByPath).forEach(([path, values]) => {
    console.log(`  ${path}: ${values[0]}${values.length > 1 ? ` (+ ${values.length - 1} more)` : ''}`);
  });
  console.log('');
});

// Check for numeric vs string enums in complex query
console.log('\nChecking A_Expr_Kind in complex query:');
[13, 14, 15, 16, 17].forEach(version => {
  const data = JSON.parse(fs.readFileSync(path.join(fixturesDir, version.toString(), 'complex_query.json'), 'utf8'));
  const ast = data[0].ast;
  
  // Find A_Expr nodes
  function findAExpr(obj) {
    if (!obj || typeof obj !== 'object') return [];
    
    const results = [];
    if (obj.A_Expr) {
      results.push(obj.A_Expr);
    }
    
    if (Array.isArray(obj)) {
      obj.forEach(item => results.push(...findAExpr(item)));
    } else {
      Object.values(obj).forEach(value => results.push(...findAExpr(value)));
    }
    
    return results;
  }
  
  const aExprs = findAExpr(ast);
  if (aExprs.length > 0) {
    console.log(`  Version ${version}: kind = ${JSON.stringify(aExprs[0].kind)} (type: ${typeof aExprs[0].kind})`);
  }
});