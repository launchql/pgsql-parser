import { Type, Enum, Field, ReflectionObject } from '@launchql/protobufjs';
import { isPrimitiveType } from './types';

const dependenciesResolve = (types: Type[], enums: Enum[], symbolName: string, resolved: string[], unresolved: string[]) => {
    if (symbolName === 'Node') return;

    unresolved.push(symbolName);

    let dep = [...types, ...enums].find(dep => dep.name === symbolName);
    if (!dep) {
        throw new Error(`Dependency Not Found ${symbolName}`)
    }

    const depAsType = types.find(t => t.name === dep.name);

    if (depAsType) {
        const fields = Object.values(depAsType.fields);
        for (let i = 0; i < fields.length; i++) {
            const childDep = fields[i];
            if (!resolved.includes(childDep.type)) {
                if (unresolved.includes(childDep.type)) {
                    // console.warn(`Circular reference detected ${symbolName}, ${dep}`);
                    continue;
                }
                if (!isPrimitiveType(childDep.type)) {
                    dependenciesResolve(types, enums, childDep.type, resolved, unresolved);
                }
            }
        }   
    }
    resolved.push(symbolName);
    const index = unresolved.indexOf(symbolName);
    unresolved.splice(index);
}

export const getDependencies = (name: string, types: Type[], enums: Enum[]) => {
    const resolved = [];
    const unresolved = [];
    dependenciesResolve(types, enums, name, resolved, unresolved);
    return resolved;
}

const dependentsResolve = (types, enums, symbolName, resolved, unresolved) => {
    if (symbolName === 'Node') return;

    unresolved.push(symbolName);

    [...types, ...enums].forEach(dep => {
        if (resolved.includes(dep.name) || unresolved.includes(dep.name)) {
            return;
        }

        const depAsType = types.find(t => t.name === dep.name);

        let isDependent = false;
        if (depAsType) {
            const fields: Field[] = Object.values(depAsType.fields);
            isDependent = fields.some(field => field.type === symbolName);
        } 

        if (isDependent) {
            if (unresolved.includes(dep.name)) {
                throw new Error(`Circular reference detected: ${symbolName} <-> ${dep.name}`);
            }

            dependentsResolve(types, enums, dep.name, resolved, unresolved);
        }
    });

    if (!resolved.includes(symbolName)) {
        resolved.push(symbolName);
    }

    const index = unresolved.indexOf(symbolName);
    if (index !== -1) {
        unresolved.splice(index, 1);
    }
};

export const getDependents = (symbolName, types, enums) => {
    const resolved = [];
    const unresolved = [];
    dependentsResolve(types, enums, symbolName, resolved, unresolved);
    return resolved.filter(name => name !== symbolName); // Exclude the symbol itself from its dependents
};
