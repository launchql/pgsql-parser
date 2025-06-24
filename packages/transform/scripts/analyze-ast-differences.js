const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, '../../../__fixtures__/transform');
const versions = [13, 14, 15, 16, 17];

// Helper to deep compare objects and find differences
function findDifferences(obj1, obj2, path = '') {
  const differences = [];
  
  // Handle null/undefined
  if (obj1 === null || obj1 === undefined || obj2 === null || obj2 === undefined) {
    if (obj1 !== obj2) {
      differences.push({
        path,
        type: 'value',
        from: obj1,
        to: obj2
      });
    }
    return differences;
  }
  
  // Handle primitives
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    if (obj1 !== obj2) {
      differences.push({
        path,
        type: 'value',
        from: obj1,
        to: obj2
      });
    }
    return differences;
  }
  
  // Handle arrays
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) {
      differences.push({
        path,
        type: 'array_length',
        from: obj1.length,
        to: obj2.length
      });
    }
    const minLength = Math.min(obj1.length, obj2.length);
    for (let i = 0; i < minLength; i++) {
      differences.push(...findDifferences(obj1[i], obj2[i], `${path}[${i}]`));
    }
    return differences;
  }
  
  // Handle objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = new Set([...keys1, ...keys2]);
  
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (!(key in obj1)) {
      differences.push({
        path: newPath,
        type: 'added_field',
        value: obj2[key]
      });
    } else if (!(key in obj2)) {
      differences.push({
        path: newPath,
        type: 'removed_field',
        value: obj1[key]
      });
    } else {
      differences.push(...findDifferences(obj1[key], obj2[key], newPath));
    }
  }
  
  return differences;
}

// Analyze differences between versions
function analyzeVersionDifferences(fromVersion, toVersion) {
  console.log(`\n=== Analyzing differences: v${fromVersion} → v${toVersion} ===\n`);
  
  const summaryDiffs = {
    fieldRenames: [],
    structureChanges: [],
    enumChanges: [],
    newNodes: [],
    removedNodes: []
  };
  
  // Check each query type
  const queryFiles = fs.readdirSync(path.join(fixturesDir, fromVersion.toString()))
    .filter(f => f.endsWith('.json') && f !== 'generation-summary.json');
  
  for (const queryFile of queryFiles) {
    const fromData = JSON.parse(fs.readFileSync(path.join(fixturesDir, fromVersion.toString(), queryFile), 'utf8'));
    const toData = JSON.parse(fs.readFileSync(path.join(fixturesDir, toVersion.toString(), queryFile), 'utf8'));
    
    console.log(`Analyzing ${queryFile}...`);
    
    for (let i = 0; i < fromData.length; i++) {
      if (fromData[i].error || toData[i].error) continue;
      
      const diffs = findDifferences(fromData[i].ast, toData[i].ast);
      
      // Categorize differences
      for (const diff of diffs) {
        // Skip location differences
        if (diff.path.endsWith('.location')) continue;
        
        // Detect field renames (removed + added at same level)
        if (diff.type === 'removed_field') {
          const parentPath = diff.path.substring(0, diff.path.lastIndexOf('.'));
          const addedDiff = diffs.find(d => 
            d.type === 'added_field' && 
            d.path.substring(0, d.path.lastIndexOf('.')) === parentPath
          );
          
          if (addedDiff) {
            const rename = {
              path: parentPath,
              from: diff.path.split('.').pop(),
              to: addedDiff.path.split('.').pop(),
              query: fromData[i].query,
              file: queryFile
            };
            
            // Check if we already have this rename
            const existing = summaryDiffs.fieldRenames.find(r => 
              r.from === rename.from && r.to === rename.to && r.path.endsWith(rename.path.split('.').pop())
            );
            
            if (!existing) {
              summaryDiffs.fieldRenames.push(rename);
            }
          }
        }
        
        // Detect structure changes in A_Const
        if (diff.path.includes('A_Const') && (diff.type === 'added_field' || diff.type === 'removed_field')) {
          summaryDiffs.structureChanges.push({
            path: diff.path,
            type: diff.type,
            query: fromData[i].query,
            file: queryFile
          });
        }
        
        // Detect enum value changes
        if (diff.type === 'value' && typeof diff.from === 'string' && typeof diff.to === 'string' &&
            diff.from !== diff.to && /^[A-Z_]+$/.test(diff.from) && /^[A-Z_]+$/.test(diff.to)) {
          summaryDiffs.enumChanges.push({
            path: diff.path,
            from: diff.from,
            to: diff.to,
            query: fromData[i].query,
            file: queryFile
          });
        }
      }
    }
  }
  
  // Print summary
  console.log('\n--- Summary of Changes ---\n');
  
  if (summaryDiffs.fieldRenames.length > 0) {
    console.log('Field Renames:');
    const uniqueRenames = {};
    summaryDiffs.fieldRenames.forEach(r => {
      const key = `${r.from} → ${r.to}`;
      if (!uniqueRenames[key]) {
        uniqueRenames[key] = [];
      }
      uniqueRenames[key].push(r.path.split('.').slice(-2, -1)[0]);
    });
    
    for (const [rename, nodes] of Object.entries(uniqueRenames)) {
      console.log(`  ${rename} in: ${[...new Set(nodes)].join(', ')}`);
    }
  }
  
  if (summaryDiffs.structureChanges.length > 0) {
    console.log('\nStructure Changes:');
    const uniqueChanges = new Set(summaryDiffs.structureChanges.map(c => c.path.split('.').slice(0, -1).join('.')));
    uniqueChanges.forEach(change => {
      console.log(`  ${change}`);
    });
  }
  
  if (summaryDiffs.enumChanges.length > 0) {
    console.log('\nEnum Value Changes:');
    const uniqueEnumChanges = {};
    summaryDiffs.enumChanges.forEach(e => {
      const key = `${e.from} → ${e.to}`;
      if (!uniqueEnumChanges[key]) {
        uniqueEnumChanges[key] = new Set();
      }
      uniqueEnumChanges[key].add(e.path.split('.').slice(-2, -1)[0]);
    });
    
    for (const [change, contexts] of Object.entries(uniqueEnumChanges)) {
      console.log(`  ${change} in: ${[...contexts].join(', ')}`);
    }
  }
  
  return summaryDiffs;
}

// Main analysis
console.log('PostgreSQL AST Difference Analysis');
console.log('==================================');

const allDifferences = {};

for (let i = 0; i < versions.length - 1; i++) {
  const fromVersion = versions[i];
  const toVersion = versions[i + 1];
  const key = `${fromVersion}_to_${toVersion}`;
  
  allDifferences[key] = analyzeVersionDifferences(fromVersion, toVersion);
}

// Save analysis results
const outputPath = path.join(fixturesDir, 'ast-differences-analysis.json');
fs.writeFileSync(outputPath, JSON.stringify(allDifferences, null, 2));
console.log(`\nAnalysis saved to: ${outputPath}`);