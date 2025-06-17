import { parseAndSnap } from '../test-utils';

describe('enums', () => {
  it('json enabled', () => {
    parseAndSnap('enums/json/enabled', {
      enums: {
        json: {
          enabled: true
        }
      }
    });
  });
});
