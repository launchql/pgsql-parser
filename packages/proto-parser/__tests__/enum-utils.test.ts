import { parseAndSnap } from '../test-utils';

describe('enum utils', () => {
  it('generates bidirectional enum value functions', () => {
    parseAndSnap('utils/enums/bidirectional', {
      utils: {
        enums: {
          enabled: true,
          filename: 'enum-utils.ts'
        }
      }
    });
  });

  it('generates unidirectional enum functions', () => {
    parseAndSnap('utils/enums/unidirectional', {
      utils: {
        enums: {
          enabled: true,
          unidirectional: true,
          toIntFilename: 'enum-to-int-utils.ts',
          toStringFilename: 'enum-to-string-utils.ts'
        }
      }
    });
  });

  it('respects custom filenames for unidirectional functions', () => {
    parseAndSnap('utils/enums/custom-filenames', {
      utils: {
        enums: {
          enabled: true,
          unidirectional: true,
          toIntFilename: 'custom-int.ts',
          toStringFilename: 'custom-string.ts'
        }
      }
    });
  });

  it('generates only bidirectional when unidirectional is false', () => {
    parseAndSnap('utils/enums/bidirectional-explicit', {
      utils: {
        enums: {
          enabled: true,
          unidirectional: false,
          filename: 'bidirectional.ts'
        }
      }
    });
  });
});