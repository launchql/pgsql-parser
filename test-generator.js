const fs = require('fs');
const path = require('path');

const protoContent = fs.readFileSync(path.join(__dirname, '__fixtures__/proto/17-latest.proto'), 'utf8');

const nodeMatch = protoContent.match(/message Node\s*\{[^}]*oneof node\s*\{([^}]*)\}/s);
if (nodeMatch) {
  const oneofContent = nodeMatch[1];
  const typeMatches = oneofContent.match(/(\w+)\s+\w+\s*=\s*\d+/g);
  
  if (typeMatches) {
    const wrappedTypes = typeMatches.map(match => {
      const parts = match.trim().split(/\s+/);
      return parts[0];
    });
    
    console.log(`Found ${wrappedTypes.length} wrapped types:`);
    console.log(JSON.stringify(wrappedTypes.slice(0, 10), null, 2));
    console.log('...');
    
    const specialTypes = ['TypeName', 'RangeVar'];
    const missingFromSpecial = specialTypes.filter(type => !wrappedTypes.includes(type));
    const extraInSpecial = specialTypes.filter(type => wrappedTypes.includes(type));
    
    console.log('\nAnalysis:');
    console.log(`TypeName in wrapped types: ${wrappedTypes.includes('TypeName')}`);
    console.log(`RangeVar in wrapped types: ${wrappedTypes.includes('RangeVar')}`);
    console.log(`Both should be in SPECIAL_TYPES: ${extraInSpecial.length === 2}`);
  }
}
