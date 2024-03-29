export interface ConfigOptions {
    rsc?: {
        componentType: "client";
    };
}
export interface ParserComponentInterface {
    name: string;
    refs: ParserComponentRef[];
    state: ParserComponentState;
}
export interface ParserComponentRefInterface {
    name: string;
    used?: boolean;
    forward?: boolean;
}
export declare class ParserComponentRef implements ParserComponentRefInterface {
    name: string;
    used?: boolean;
    forward?: boolean;
    constructor(options: ParserComponentRefInterface);
}
export interface ParserComponentStateInterface {
    properties: ParserComponentStateProperty[];
    exists(name: string): boolean;
    get(name: string): ParserComponentStateProperty | undefined;
}
export interface ParserComponentStatePropertyInterface {
    name: string;
    derived: 'useState' | 'useStore';
    from: 'ObjectProperty' | 'ObjectMethod';
    used?: boolean;
}
declare class ParserComponentStateProperty implements ParserComponentStatePropertyInterface {
    name: string;
    derived: 'useState' | 'useStore';
    from: 'ObjectProperty' | 'ObjectMethod';
    used?: boolean;
    constructor(options: ParserComponentStatePropertyInterface);
    setUsed(used: boolean): void;
}
declare class ParserComponentState implements ParserComponentStateInterface {
    properties: ParserComponentStateProperty[];
    constructor();
    exists(name: string): boolean;
    get(name: string): ParserComponentStateProperty | undefined;
}
declare class ParserComponent implements ParserComponentInterface {
    name: string;
    refs: ParserComponentRef[];
    state: ParserComponentState;
    constructor(name: string);
    addRef(options: ParserComponentRefInterface): void;
    findRef(name: string): ParserComponentRef | undefined;
    hasForwardRef(): boolean;
    findForwardRef(): ParserComponentRef | undefined;
    hasRef(name: string): boolean;
    addProp(options: ParserComponentStatePropertyInterface): void;
    findProp(name: string): ParserComponentStateProperty | undefined;
    hasProp(name: string): boolean;
}
type ParserErrorMsg = 'REF_NOT_FOUND' | 'PROP_NOT_FOUND' | 'PROP_SET_NOT_FOUND' | 'COMP_NOT_FOUND' | 'PROP_FUNC_NOT_FOUND' | 'PROP_FUNC_COMP_NOT_FOUND';
export declare class ParserScope {
    components: ParserComponent[];
    cursor?: string;
    defaultForwardRefExport?: string;
    configOptions?: ConfigOptions;
    constructor();
    addComponent(name: string): void;
    findComponent(name: string): ParserComponent | undefined;
    currentComponent(throws?: boolean): ParserComponent | undefined;
    setCursor(newCursor: string | null): void;
    errorMsg(error: ParserErrorMsg, params?: any): string;
}
export {};
