# AST Transformer Implementation

### Transformers

#### v13 → v14 (`v13-to-v14.ts`)
- **Changes**: Field rename `relkind` → `objtype`
- **Affected nodes**: `AlterTableStmt`, `CreateTableAsStmt`

#### v14 → v15 (`v14-to-v15.ts`)
- **Major change**: A_Const structure flattening
  - Before: `A_Const.val.String.str`
  - After: `A_Const.sval.sval`
- **Field renames**:
  - `String.str` → `String.sval`
  - `BitString.str` → `BitString.bsval`
  - `Float.str` → `Float.fval`
- **Other changes**:
  - `tables` → `pubobjects` in publication statements
  - `tableAction` → `action` in `AlterPublicationStmt`

#### v15 → v16 (`v15-to-v16.ts`)
- **Changes**: Minimal for basic queries
- **Advanced features**: Support for Var node changes, Aggref field rename

#### v16 → v17 (`v16-to-v17.ts`)
- **Changes**: None for basic queries
- **Note**: Pass-through transformer for compatibility
