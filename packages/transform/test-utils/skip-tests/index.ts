export type SkipTest = [
    versionPrevious: number,
    versionNext: number,
    test: string,
    reason: string
];

export { parserErrors } from './parser-errors';
export { transformerErrors } from './transformer-errors';

import { parserErrors } from './parser-errors';
import { transformerErrors } from './transformer-errors';

// Combined export for backward compatibility
export const skipTests: SkipTest[] = [
    ...parserErrors,
    ...transformerErrors
];
