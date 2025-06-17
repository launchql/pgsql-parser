import { Namespace } from '@launchql/protobufjs';
import { NodeSpec } from './types';
export declare class RuntimeSchemaGenerator {
    private root;
    private wrappedTypes;
    constructor(root: Namespace);
    private extractWrappedTypes;
    generateNodeSpecs(): NodeSpec[];
    private createNodeSpec;
    private createFieldSpec;
    getWrappedTypes(): string[];
    getWrappedTypesCount(): number;
}
