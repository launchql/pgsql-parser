const fs = require('fs');
const { PgProtoParser } = require('pg-proto-parser');
const { resolve, join } = require('path');
const inFile = __dirname + '/pg_query.proto';
const outDir = resolve(join(__dirname, '/../src/enums'));

function reorderJsonFile(filePath) {
  // Read the JSON file
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(fileContents);

  // Get the keys and sort them
  const sortedKeys = Object.keys(json).sort();

  // Rebuild the object with sorted keys
  const sortedJson = {};
  for (const key of sortedKeys) {
    sortedJson[key] = json[key];
  }

  // Write the sorted JSON back to the file
  fs.writeFileSync(filePath, JSON.stringify(sortedJson, null, 2));
}

const parser = new PgProtoParser(inFile, {
  outDir,
  includeEnumsJSON: true,
  includeTypes: false,
  includeUtils: false,
  removeUndefinedAt0: true
});
parser.write();
reorderJsonFile(join(outDir, 'enums2int.json'));
reorderJsonFile(join(outDir, 'enums2str.json'));
