import { parseAndSnap } from '../test-utils';

it('json', () => {
  parseAndSnap('json', {
    enums: {
      json: {
        enabled: true
      }
    }
  });
});
