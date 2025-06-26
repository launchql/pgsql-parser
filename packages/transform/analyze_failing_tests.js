const { parse } = require('@pgsql/parser');

const failingQueries = [
  "EXPLAIN (COSTS OFF) SELECT * FROM document WHERE f_leak(dtitle)",
  "INSERT INTO base_tbl SELECT i, 'Row ' || i FROM generate_series(-2, 2) g(i)",
  "ALTER TABLE tmp7 ADD CONSTRAINT identity CHECK (b = boo(b))",
  "COMMENT ON FUNCTION tg_hub_adjustslots_wrong(bpchar, integer, integer) IS 'function with args'",
  "DROP FUNCTION echo_me(anyenum)",
  "SELECT repeat('[', 10000)::jsonb",
  "CREATE TABLE log_table (tstamp timestamp default timeofday()::timestamp)"
];

console.log("Analyzing failing test AST structures between PG13 and PG14...\n");

failingQueries.forEach((sql, index) => {
  console.log(`=== Query ${index + 1}: ${sql} ===`);
  try {
    const result13 = parse(sql, { version: '13' });
    const result14 = parse(sql, { version: '14' });
    
    if (result13 && result14) {
      const json13 = JSON.stringify(result13, null, 2);
      const json14 = JSON.stringify(result14, null, 2);
      
      if (json13 !== json14) {
        console.log("STRUCTURAL DIFFERENCES DETECTED!");
        
        const funcformat13 = (json13.match(/"funcformat"/g) || []).length;
        const funcformat14 = (json14.match(/"funcformat"/g) || []).length;
        const objfuncargs13 = (json13.match(/"objfuncargs"/g) || []).length;
        const objfuncargs14 = (json14.match(/"objfuncargs"/g) || []).length;
        
        console.log(`PG13 funcformat count: ${funcformat13}, PG14: ${funcformat14}`);
        console.log(`PG13 objfuncargs count: ${objfuncargs13}, PG14: ${objfuncargs14}`);
        
        const fields13 = new Set(json13.match(/"[a-zA-Z_][a-zA-Z0-9_]*":/g) || []);
        const fields14 = new Set(json14.match(/"[a-zA-Z_][a-zA-Z0-9_]*":/g) || []);
        
        const onlyIn13 = [...fields13].filter(f => !fields14.has(f));
        const onlyIn14 = [...fields14].filter(f => !fields13.has(f));
        
        if (onlyIn13.length > 0) console.log("Fields only in PG13:", onlyIn13);
        if (onlyIn14.length > 0) console.log("Fields only in PG14:", onlyIn14);
        
      } else {
        console.log("No structural differences found");
      }
    }
  } catch (error) {
    console.log("Parse error:", error.message);
  }
  console.log("---\n");
});
