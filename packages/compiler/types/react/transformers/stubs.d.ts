import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
export declare const verifyStubsToReact: (path: NodePath<t.ImportDeclaration>) => void;
export declare const stubsToReact: (path: NodePath<t.ImportDeclaration>) => void;
