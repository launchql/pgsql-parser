import { ParserScope } from "../scope";
export declare const parse: (ast: any, clean?: boolean) => {
    scope: ParserScope;
    ast: any;
};
