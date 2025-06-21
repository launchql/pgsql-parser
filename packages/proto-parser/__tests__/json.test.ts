import { parseAndSnap } from '../test-utils';

describe('enums', () => {
  it('enumMap json enabled', () => {
    parseAndSnap('enums/json/enabled', {
      enums: {
        enumMap: {
          enabled: true,
          format: 'json'
        }
      }
    });
  });

  it('enumMap ts enabled', () => {
    parseAndSnap('enums/ts/enabled', {
      enums: {
        enumMap: {
          enabled: true,
          format: 'ts'
        }
      }
    });
  });
});
