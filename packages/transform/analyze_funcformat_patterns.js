const { Parser } = require('@pgsql/parser');

const testQueries = [
  "SELECT TRIM(BOTH ' ' FROM '  hello  ')",
  "SELECT SUBSTRING('hello' FROM 2 FOR 3)",
  "SELECT POSITION('ll' IN 'hello')",
  "SELECT OVERLAY('hello' PLACING 'XX' FROM 2 FOR 2)",
  
  "SELECT EXTRACT(YEAR FROM CURRENT_DATE)",
  "SELECT DATE_PART('month', CURRENT_TIMESTAMP)",
  "SELECT DATE_TRUNC('day', NOW())",
  
  "SELECT LENGTH('hello')",
  "SELECT UPPER('hello')",
  "SELECT LOWER('HELLO')",
  "SELECT CONCAT('a', 'b')",
  
  "SELECT ABS(-5)",
  "SELECT ROUND(3.14159, 2)",
  "SELECT CEIL(3.14)",
  "SELECT FLOOR(3.14)",
  
  "SELECT AVG(column1) FROM table1",
  "SELECT SUM(column1) FROM table1",
  "SELECT COUNT(*) FROM table1",
  
  "SELECT CAST(AVG(column1) AS NUMERIC(10,3)) FROM table1",
  "SELECT CAST(SUM(column1) AS INTEGER) FROM table1"
];

console.log("Analyzing funcformat patterns between PG13 and PG14...\n");

const parser13 = new Parser(13);
const parser14 = new Parser(14);

testQueries.forEach((sql, index) => {
  console.log(`=== Query ${index + 1}: ${sql} ===`);
  try {
    const result13 = parser13.parse(sql);
    const result14 = parser14.parse(sql);
    
    if (result13 && result14) {
      const json13 = JSON.stringify(result13, null, 2);
      const json14 = JSON.stringify(result14, null, 2);
      
      const funcformat13 = json13.match(/"funcformat":\s*"([^"]+)"/g) || [];
      const funcformat14 = json14.match(/"funcformat":\s*"([^"]+)"/g) || [];
      
      console.log(`PG13 funcformat: ${funcformat13.join(', ') || 'none'}`);
      console.log(`PG14 funcformat: ${funcformat14.join(', ') || 'none'}`);
      
      const funcnames13 = json13.match(/"str":\s*"([a-zA-Z_][a-zA-Z0-9_]*)"(?=.*"funcformat")/g) || [];
      const funcnames14 = json14.match(/"str":\s*"([a-zA-Z_][a-zA-Z0-9_]*)"(?=.*"funcformat")/g) || [];
      
      if (funcnames14.length > 0) {
        console.log(`Functions with funcformat in PG14: ${funcnames14.join(', ')}`);
      }
      
      if (json13 !== json14) {
        console.log("DIFFERENCE DETECTED!");
      } else {
        console.log("No differences found");
      }
    }
  } catch (error) {
    console.log("Parse error:", error.message);
  }
  console.log("---\n");
});
