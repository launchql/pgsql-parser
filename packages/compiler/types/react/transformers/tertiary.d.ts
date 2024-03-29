import * as t from '@babel/types';
import { NodePath } from '@babel/traverse';
import { ParserScope } from '../../scope';
export declare const parseTertiary: (path: NodePath<t.JSXElement>, scope: ParserScope) => [NodePath<t.JSXExpressionContainer>];
