/**
 * Converts an AST (Abstract Syntax Tree) representation of a SQL query into
 * a meta-level AST that represents the code to generate the original AST.
 * This meta-level AST can then be used to programmatically construct the AST
 * for similar SQL queries. Essentially, it's an AST that describes how to
 * build an AST, enabling dynamic code generation based on the structure of
 * the original SQL AST.
 */
export declare function generateTsAstCodeFromPgAst(ast: any): any;
