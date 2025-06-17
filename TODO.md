TODO


- read DEVELOPMENT.md to understand how to develop
- read DEPARSER.md to udnerstand the tasks
- read IMPLEMENTATION_PLAN.md to udnerstand the tasks
- read packages/types/src/enums.ts to find any enums for types
- read, if for some reason, you need to parse enums/numbers (which you should not as they should be strings) — you can read this packages/enums/src/enums.ts
- read packages/types/src/types.ts to see the AST types for parse/deparse

- fix the tests that are currently written, you'll see they have some issues with RangeVar being a "wrapped" node type when it should be inlined, all you need to do is look at the types in @pgsql/types and you'll see :) 






FUTURE STUFF, after we get deparser working
- get wrapped types working again