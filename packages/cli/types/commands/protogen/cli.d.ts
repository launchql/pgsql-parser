export interface CommandOptions {
    help?: boolean;
    h?: boolean;
    version?: boolean;
    v?: boolean;
    protoUrl?: string;
    inFile: string;
    outFile: string;
    originalPackageName: string;
    newPackageName: string;
}
export declare const help: () => void;
declare const _default: (argv: CommandOptions) => Promise<CommandOptions>;
export default _default;
