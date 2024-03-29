import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { ParserScope } from '../../scope';
export declare const validateImports: (path: NodePath<t.ImportDeclaration>, scope: ParserScope) => void;
