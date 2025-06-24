const fs = require('fs');
const path = require('path');
const { Parser } = require('@pgsql/parser');

// Test queries to generate ASTs for
const queries = {
  'select_simple': [
    'SELECT 1',
    'SELECT NULL',
    "SELECT 'hello'::text"
  ],
  'select_with_join': [
    'SELECT * FROM users u JOIN orders o ON u.id = o.user_id'
  ],
  'insert_basic': [
    "INSERT INTO users (name, email) VALUES ('John', 'john@example.com')"
  ],
  'update_basic': [
    "UPDATE users SET name = 'Jane' WHERE id = 1"
  ],
  'delete_basic': [
    'DELETE FROM users WHERE id = 1'
  ],
  'create_table': [
    'CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email VARCHAR(255))'
  ],
  'alter_table': [
    'ALTER TABLE users ADD COLUMN email TEXT',
    'ALTER TABLE users DROP COLUMN email',
    'ALTER TABLE users RENAME COLUMN name TO full_name'
  ],
  'complex_query': [
    `WITH user_orders AS (
      SELECT u.id, u.name, COUNT(o.id) as order_count
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id, u.name
    )
    SELECT 
      id,
      name,
      order_count,
      RANK() OVER (ORDER BY order_count DESC) as rank
    FROM user_orders
    WHERE order_count > 0`
  ]
};

// PostgreSQL versions to test
const versions = [13, 14, 15, 16, 17];

// Base directory for fixtures
const fixturesDir = path.join(__dirname, '../../../__fixtures__/transform');

// Ensure directories exist
versions.forEach(version => {
  const versionDir = path.join(fixturesDir, version.toString());
  if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });
  }
});

async function generateASTsForVersion(version) {
  console.log(`\nGenerating ASTs for PostgreSQL ${version}...`);
  
  try {
    const parser = new Parser(version);
    
    for (const [filename, queryList] of Object.entries(queries)) {
      console.log(`  Processing ${filename}...`);
      
      const results = [];
      
      for (const query of queryList) {
        try {
          const ast = await parser.parse(query);
          results.push({
            query,
            ast
          });
        } catch (error) {
          console.error(`    Error parsing query: ${query}`);
          console.error(`    Error: ${error.message}`);
          results.push({
            query,
            error: error.message
          });
        }
      }
      
      // Write results to file
      const outputPath = path.join(fixturesDir, version.toString(), `${filename}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      console.log(`    Written to ${outputPath}`);
    }
  } catch (error) {
    console.error(`Failed to create parser for version ${version}: ${error.message}`);
  }
}

async function generateAllASTs() {
  console.log('Starting AST generation for all PostgreSQL versions...');
  
  for (const version of versions) {
    await generateASTsForVersion(version);
  }
  
  console.log('\nAST generation complete!');
  
  // Generate a summary file
  const summary = {
    generated: new Date().toISOString(),
    versions,
    queries: Object.keys(queries),
    queryDetails: queries
  };
  
  fs.writeFileSync(
    path.join(fixturesDir, 'generation-summary.json'),
    JSON.stringify(summary, null, 2)
  );
  console.log('\nSummary written to generation-summary.json');
}

// Run the generation
generateAllASTs().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});