import { parseAndSnap } from '../test-utils';

describe('types', () => {
  it('optionalFields', () => {
    parseAndSnap('types/optionalFields', {
      types: {
        enabled: true,
        optionalFields: false
      }
    });
  });
  it('fieldsRequired', () => {
    parseAndSnap('types/fieldsRequired', {
        types: {
          enabled: true
        }
    });
  });
  it('wrapped', () => {
    parseAndSnap('types/wrapped', {
        types: {
          enabled: true,
          enumsSource: 'my-enums.ts',
          wrapped: true,
          filename: 'wrapped.ts'
        }
    });
  });
});
