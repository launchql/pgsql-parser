import { parseAndSnap } from '../test-utils';

it('types', () => {
  parseAndSnap('types', {
    types: {
      enabled: true,
      optionalFields: false
    }
  });
});

it('keep undefined', () => {
  parseAndSnap('undef', {
    types: {
      enabled: true
    }
  });
});
