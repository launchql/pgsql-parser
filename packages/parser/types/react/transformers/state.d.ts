import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { ParserScope } from '../../scope';
export declare const validateStateVariableDeclarator: (path: NodePath<t.VariableDeclarator>, scope: ParserScope) => never;
export declare const useStateVariableDeclarator: (path: NodePath<t.VariableDeclarator>, scope: ParserScope) => void;
export declare const useStoreVariableDeclarator: (path: NodePath<t.VariableDeclarator>, scope: ParserScope) => void;
export declare const stateAssignments: (path: NodePath<t.AssignmentExpression>, scope: ParserScope) => never;
export declare const stateFunctions: (path: NodePath<t.CallExpression>, scope: ParserScope) => never;
export declare const defaultProps: (path: NodePath<t.CallExpression>, scope: ParserScope) => void;
