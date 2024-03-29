import { ParserOptions } from '@babel/parser';
export * from '../generic/transformers/component';
export declare const throwError: (str: any) => never;
export declare const fileToAst: (path: string, parserOptions?: ParserOptions) => import("@babel/parser").ParseResult<import("@babel/types").File>;
export declare const strToAst: (str: string, parserOptions?: ParserOptions) => import("@babel/parser").ParseResult<import("@babel/types").File>;
