import * as t from '@babel/types';
export declare const getTSType: (type?: string) => t.TSBooleanKeyword | t.TSBigIntKeyword | t.TSNumberKeyword | t.TSStringKeyword | t.TSTypeReference;
export declare const resolveTypeName: (type: string) => t.TSBooleanKeyword | t.TSBigIntKeyword | t.TSNumberKeyword | t.TSStringKeyword | t.TSTypeReference;
