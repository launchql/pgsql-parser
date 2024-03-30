import { Service, Type, Field, Enum, Root, Namespace, ReflectionObject } from '@launchql/protobufjs';

export const generateEnum2StrJSON = (enums: Enum[]) => {
    const valueToName = {};

    enums.forEach(enumObj => {
        valueToName[enumObj.name] = {};

        for (const [key, value] of Object.entries(enumObj.values)) {
            valueToName[enumObj.name][value] = key;
        }
    });

    return valueToName;
};

export const generateEnum2IntJSON = (enums: Enum[]) => {
    const nameToValue = {};

    enums.forEach(enumObj => {
        nameToValue[enumObj.name] = {};

        for (const [key, value] of Object.entries(enumObj.values)) {
            nameToValue[enumObj.name][key] = value;
        }
    });

    return nameToValue;
};