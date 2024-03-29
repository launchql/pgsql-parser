import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { ParserScope } from '../../scope';
export declare const isJSXReturn: (path: NodePath<t.ReturnStatement>) => boolean;
export declare const isTopLevelDefinition: (path: NodePath<t.FunctionDeclaration | t.VariableDeclaration>) => boolean;
export declare const isTopLevelFunctionDeclaration: (path: NodePath<t.FunctionDeclaration>) => boolean;
export declare const getCurrentJSXComponentByFunctionDeclaration: (path: NodePath<t.FunctionDeclaration>, scope: ParserScope) => void;
export declare const isTopLevelArrowFunctionExpressionVariableDeclaration: (path: NodePath<t.VariableDeclaration>) => boolean;
export declare const getCurrentJSXComponentByArrowFunctionVariableDeclaration: (path: NodePath<t.VariableDeclaration>, scope: ParserScope) => void;
