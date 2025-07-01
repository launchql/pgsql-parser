## debugging nodes

you can put any sql here packages/transform/scripts/input.sql

then in packages/transform
yarn test:ast

it will generate
packages/transform/scripts/output-v13.json
packages/transform/scripts/output-v14.json
packages/transform/scripts/output-v15.json
packages/transform/scripts/output-v16.json
packages/transform/scripts/output-v17.json

so you can study the resulting AST 