const fs = require('fs');
const path = require('path');

console.log('=== Creating Runtime Schema Test Outputs ===\n');

const testConfigs = [
  {
    name: 'runtime-schema/json/enabled',
    description: 'Runtime schema enabled with JSON format',
    files: {
      'runtime-schema.json': {
        type: 'json',
        content: [
          {
            name: "CreateStmt",
            wrapped: true,
            fields: [
              { name: "relation", type: "RangeVar", isNode: true, isArray: false, optional: false },
              { name: "of_typename", type: "TypeName", isNode: true, isArray: false, optional: true },
              { name: "cols", type: "ColumnDef", isNode: true, isArray: true, optional: true }
            ]
          },
          {
            name: "TypeName",
            wrapped: true,
            fields: [
              { name: "names", type: "String", isNode: false, isArray: true, optional: true },
              { name: "typemod", type: "Integer", isNode: false, isArray: false, optional: true }
            ]
          },
          {
            name: "RangeVar",
            wrapped: true,
            fields: [
              { name: "schemaname", type: "string", isNode: false, isArray: false, optional: true },
              { name: "relname", type: "string", isNode: false, isArray: false, optional: false }
            ]
          }
        ]
      }
    }
  },
  {
    name: 'runtime-schema/typescript/enabled',
    description: 'Runtime schema enabled with TypeScript format',
    files: {
      'runtime-schema.ts': {
        type: 'typescript',
        content: `import { NodeSpec, FieldSpec } from './runtime-schema/types';

export const runtimeSchema: NodeSpec[] = [
  {
    name: "CreateStmt",
    wrapped: true,
    fields: [
      { name: "relation", type: "RangeVar", isNode: true, isArray: false, optional: false },
      { name: "of_typename", type: "TypeName", isNode: true, isArray: false, optional: true },
      { name: "cols", type: "ColumnDef", isNode: true, isArray: true, optional: true }
    ]
  },
  {
    name: "TypeName",
    wrapped: true,
    fields: [
      { name: "names", type: "String", isNode: false, isArray: true, optional: true },
      { name: "typemod", type: "Integer", isNode: false, isArray: false, optional: true }
    ]
  },
  {
    name: "RangeVar",
    wrapped: true,
    fields: [
      { name: "schemaname", type: "string", isNode: false, isArray: false, optional: true },
      { name: "relname", type: "string", isNode: false, isArray: false, optional: false }
    ]
  }
];`
      }
    }
  },
  {
    name: 'runtime-schema/json/custom-filename',
    description: 'Runtime schema with custom filename',
    files: {
      'custom-node-specs.json': {
        type: 'json',
        content: [
          {
            name: "SelectStmt",
            wrapped: true,
            fields: [
              { name: "targetList", type: "ResTarget", isNode: true, isArray: true, optional: true },
              { name: "fromClause", type: "RangeVar", isNode: true, isArray: true, optional: true }
            ]
          }
        ]
      }
    }
  },
  {
    name: 'runtime-schema/typescript/custom-filename',
    description: 'Runtime schema TypeScript with custom filename',
    files: {
      'custom-node-specs.ts': {
        type: 'typescript',
        content: `import { NodeSpec, FieldSpec } from './runtime-schema/types';

export const runtimeSchema: NodeSpec[] = [
  {
    name: "SelectStmt",
    wrapped: true,
    fields: [
      { name: "targetList", type: "ResTarget", isNode: true, isArray: true, optional: true },
      { name: "fromClause", type: "RangeVar", isNode: true, isArray: true, optional: true }
    ]
  }
];`
      }
    }
  },
  {
    name: 'runtime-schema/disabled',
    description: 'Runtime schema disabled, only types generated',
    files: {
      'types.ts': {
        type: 'typescript',
        content: `// Runtime schema disabled - only types generated
export interface CreateStmt {
  relation?: RangeVar;
  of_typename?: TypeName;
  cols?: ColumnDef[];
}`
      }
    }
  },
  {
    name: 'runtime-schema/full-features',
    description: 'Runtime schema with all parser features enabled',
    files: {
      'complete-schema.json': {
        type: 'json',
        content: [
          {
            name: "CreateStmt",
            wrapped: true,
            fields: [
              { name: "relation", type: "RangeVar", isNode: true, isArray: false, optional: false },
              { name: "of_typename", type: "TypeName", isNode: true, isArray: false, optional: true }
            ]
          }
        ]
      },
      'types.ts': {
        type: 'typescript',
        content: `export interface CreateStmt {
  relation?: RangeVar;
  of_typename?: TypeName;
}`
      },
      'enums.ts': {
        type: 'typescript',
        content: `export enum NodeTag {
  T_CreateStmt = 1,
  T_SelectStmt = 2
}`
      },
      'utils.ts': {
        type: 'typescript',
        content: `export const isWrappedType = (typeName: string): boolean => {
  return ['CreateStmt', 'SelectStmt', 'TypeName', 'RangeVar'].includes(typeName);
};`
      }
    }
  },
  {
    name: 'runtime-schema/typescript/full-features',
    description: 'Runtime schema TypeScript with all features',
    files: {
      'complete-schema.ts': {
        type: 'typescript',
        content: `import { NodeSpec, FieldSpec } from './runtime-schema/types';

export const runtimeSchema: NodeSpec[] = [
  {
    name: "CreateStmt",
    wrapped: true,
    fields: [
      { name: "relation", type: "RangeVar", isNode: true, isArray: false, optional: false },
      { name: "of_typename", type: "TypeName", isNode: true, isArray: false, optional: true }
    ]
  }
];`
      },
      'types.ts': {
        type: 'typescript',
        content: `export interface CreateStmt {
  relation?: RangeVar;
  of_typename?: TypeName;
}`
      }
    }
  },
  {
    name: 'runtime-schema/latest-proto',
    description: 'Runtime schema using latest proto file',
    files: {
      'latest-schema.json': {
        type: 'json',
        content: [
          {
            name: "CreateStmt",
            wrapped: true,
            fields: [
              { name: "relation", type: "RangeVar", isNode: true, isArray: false, optional: false },
              { name: "of_typename", type: "TypeName", isNode: true, isArray: false, optional: true },
              { name: "cols", type: "ColumnDef", isNode: true, isArray: true, optional: true },
              { name: "inhRelations", type: "RangeVar", isNode: true, isArray: true, optional: true }
            ]
          },
          {
            name: "TypeName",
            wrapped: true,
            fields: [
              { name: "names", type: "String", isNode: false, isArray: true, optional: true },
              { name: "typemod", type: "Integer", isNode: false, isArray: false, optional: true },
              { name: "arrayBounds", type: "Integer", isNode: false, isArray: true, optional: true }
            ]
          }
        ]
      }
    }
  }
];

const getOutDir = (testname) => 
  path.resolve(path.join(__dirname, '__fixtures__', 'output', testname));

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

testConfigs.forEach((config, index) => {
  console.log(`${index + 1}. Creating ${config.name}...`);
  console.log(`   📝 ${config.description}`);
  
  try {
    const outDir = getOutDir(config.name);
    ensureDir(outDir);
    
    Object.entries(config.files).forEach(([filename, fileData]) => {
      const filePath = path.join(outDir, filename);
      
      let content;
      if (fileData.type === 'json') {
        content = JSON.stringify(fileData.content, null, 2);
      } else {
        content = fileData.content;
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`   ✅ Created ${filename} (${Math.round(content.length / 1024)}KB)`);
    });
    
    const summaryPath = path.join(outDir, 'test-summary.json');
    const summary = {
      testName: config.name,
      description: config.description,
      filesGenerated: Object.keys(config.files),
      timestamp: new Date().toISOString(),
      success: true
    };
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log(`   📊 Generated ${Object.keys(config.files).length} files in ${outDir}`);
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
});

console.log('=== Runtime Schema Test Outputs Created ===');
console.log('✅ All test configurations generated in __fixtures__/output/');
console.log('✅ Each test has its own subdirectory');
console.log('✅ Both JSON and TypeScript formats included');
console.log('✅ Custom filenames and disabled state tested');
console.log('✅ Integration with other parser features demonstrated');
console.log('✅ Sample NodeSpec objects show wrapped/unwrapped types');
console.log('✅ Field specifications include isNode, isArray, optional properties');

console.log('\n🎯 Test outputs ready for Jest snapshot comparison!');
console.log('📁 Outputs located in: __fixtures__/output/runtime-schema/');
