
we are a building transformers so we can upgrade PG13 ASTs to PG17, stepwise, so one major version at a time.

First only work on packages/transform/src/transformers/v13-to-v14.ts

and only work by testing like this to only run tests inside of the PG13 -> PG14 :

yarn test:watch __tests__/kitchen-sink/13-14

More info:
review packages/transform/AST_TEST_STRATEGY.md
review packages/transform/AST_NOTES.md
review packages/transform/AST_PLAN.md
review packages/transform/AST_RESEARCH.md
review packages/transform/AST_TRANSLATION.md
review packages/transform/AST_PLAN.md

to test first, in root

yarn
yarn build

then

cd packages/transform

then to test you can use this:
yarn test
or
yarn test:watch

Rule:

DO not remove type types from the Transformers, 
DO not do any special cases for TypeName or RangeVar — you must understand how to properly and dynamically return the proper type, either wrapped node or not (wrapped: { Type: Type } and inline: Type ) — based on either by studying the types, letting the type system help you, or as a last resort, using the runtime schema, and looking it up at runtime based on the FieldSpec.