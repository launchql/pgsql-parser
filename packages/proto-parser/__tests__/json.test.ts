import { parseAndSnap } from '../test-utils';

describe('enums', () => {
  it('enumMap json enabled', () => {
    parseAndSnap('enums/json/enabled', {
      enums: {
        enumMap: {
          enabled: true,
          format: 'json',
          toIntOutFile: 'enums2int.json',
          toStrOutFile: 'enums2str.json'
        }
      }
    });
  });

  it('enumMap ts enabled', () => {
    parseAndSnap('enums/ts/enabled', {
      enums: {
        enumMap: {
          enabled: true,
          format: 'ts',
          toIntOutFile: 'enums2int.ts',
          toStrOutFile: 'enums2str.ts'
        }
      }
    });
  });
});
