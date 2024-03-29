import { type RootNode } from "@vue/compiler-core";
import { ParserScope } from "../scope";
export declare const parse: (ast: any, clean?: boolean) => {
    type: string;
    ast: RootNode;
    scope: ParserScope;
    code: string;
};
