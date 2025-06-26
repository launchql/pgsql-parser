const parse = require('@pgsql/parser').default;

const testSQL = `DROP TABLE num_data;`;

console.log("Investigating structural differences between PG13 and PG14...\n");

try {
  const result13 = parse(testSQL, { version: '13' });
  const result14 = parse(testSQL, { version: '14' });
  
  console.log("=== PG13 Structure ===");
  console.log(JSON.stringify(result13, null, 2));
  
  console.log("\n=== PG14 Structure ===");
  console.log(JSON.stringify(result14, null, 2));
  
  const json13 = JSON.stringify(result13);
  const json14 = JSON.stringify(result14);
  
  console.log("\n=== String Node Analysis ===");
  const stringMatches13 = json13.match(/"String":\s*{[^}]*}/g) || [];
  const stringMatches14 = json14.match(/"String":\s*{[^}]*}/g) || [];
  
  console.log("PG13 String nodes:", stringMatches13);
  console.log("PG14 String nodes:", stringMatches14);
  
  console.log("\n=== Field Analysis ===");
  console.log("PG13 has 'str' field:", json13.includes('"str":'));
  console.log("PG14 has 'str' field:", json14.includes('"str":'));
  console.log("PG13 has 'sval' field:", json13.includes('"sval":'));
  console.log("PG14 has 'sval' field:", json14.includes('"sval":'));
  
} catch (error) {
  console.log("Parse error:", error.message);
}
