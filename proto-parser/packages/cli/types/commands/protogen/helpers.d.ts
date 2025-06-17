export declare const downloadProtoFile: (protoUrl: string, filePath: string) => Promise<void>;
export declare const generateProtoJS: (inFile: string, outFile: string) => Promise<void>;
export declare const replaceTextInProtoJS: (filePath: string, originalPackage: string, newPackage: string) => Promise<void>;
