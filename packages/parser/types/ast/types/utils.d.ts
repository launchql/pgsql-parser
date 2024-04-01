import * as t from '@babel/types';
export declare const getTSType: (type?: string) => t.TSBigIntKeyword | t.TSBooleanKeyword | t.TSNumberKeyword | t.TSStringKeyword | t.TSTypeReference;
export declare const resolveTypeName: (type: string) => t.TSBigIntKeyword | t.TSBooleanKeyword | t.TSNumberKeyword | t.TSStringKeyword | t.TSTypeReference;
