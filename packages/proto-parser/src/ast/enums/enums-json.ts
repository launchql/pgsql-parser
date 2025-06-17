import { Enum } from '@launchql/protobufjs';

type EnumValueToName = Record<string, Record<number, string>>;
type EnumNameToValue = Record<string, Record<string, number>>;

export const generateEnum2StrJSON = (enums: Enum[]): EnumValueToName => {
    const valueToName: EnumValueToName = {};

    enums.forEach(enumObj => {
        valueToName[enumObj.name] = {};

        for (const [key, value] of Object.entries(enumObj.values)) {
            valueToName[enumObj.name][value as number] = key;
        }
    });

    return valueToName;
};

export const generateEnum2IntJSON = (enums: Enum[]): EnumNameToValue => {
    const nameToValue: EnumNameToValue = {};

    enums.forEach(enumObj => {
        nameToValue[enumObj.name] = {};

        for (const [key, value] of Object.entries(enumObj.values)) {
            nameToValue[enumObj.name][key] = value as number;
        }
    });

    return nameToValue;
};