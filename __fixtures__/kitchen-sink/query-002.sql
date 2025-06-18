SELECT * from "Foo" f1
WHERE f1."FooUID" = (
   SELECT f2."FooUID" FROM "Foo" f2
   LEFT JOIN "Bar" b ON f2."BarUID" = b."BarUID"
   WHERE f2."BarUID" IS NOT NULL AND b."BarUID" IS NULL
   LIMIT 1
)