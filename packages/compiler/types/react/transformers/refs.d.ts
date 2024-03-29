import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { ParserScope } from '../../scope';
export declare const updateRefsIdentifier: (path: NodePath<t.Identifier>, scope: ParserScope) => void;
export declare const useRefVariableDeclarator: (path: NodePath<t.VariableDeclarator>, scope: ParserScope) => never;
export declare const isForwardRef: (path: NodePath<t.JSXAttribute>) => boolean;
export declare const getForwardRefs: (path: NodePath<t.JSXAttribute>, scope: ParserScope) => void;
export declare const processForwardRefs: (path: NodePath<t.JSXAttribute>, scope: ParserScope) => void;
export declare const updateRefFunctionDeclarations: (path: NodePath<t.FunctionDeclaration>, scope: ParserScope) => void;
