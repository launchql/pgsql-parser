import { Enum, Field } from '@launchql/protobufjs';

export const getUndefinedKey = (enumName) => {
  // Split the name into parts where a lowercase letter is followed by an uppercase letter
  const parts = enumName.split(/(?<=[a-z])(?=[A-Z])/);

  const processedParts = parts.map(part => {
    // For parts that are all uppercase and longer than 1 character, only the first character should remain uppercase
    if (part === part.toUpperCase() && part.length > 1) {
      return part.charAt(0) + part.slice(1).toLowerCase();
    }
    return part;
  });

  const upperSnakeCase = processedParts.join('_').toUpperCase();

  return `${upperSnakeCase}_UNDEFINED`;
}


export const hasUndefinedInitialValue = (enumData: Enum) => {
  const entries = Object.entries(enumData.values);
  if (entries.length === 0) return false;

  const undefinedKey = getUndefinedKey(enumData.name);
  const firstEntry = entries[0];
  return firstEntry[0] === undefinedKey && firstEntry[1] === 0;
}

export const getFieldName = (field: Field, fallbackName: string) => {
 return field.options?.json_name ? field.options.json_name : fallbackName;
}