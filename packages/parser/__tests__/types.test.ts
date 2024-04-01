import { parseAndSnap } from '../test-utils';

describe('types', () => {
  it('optionalFields', () => {
    parseAndSnap('types/optionalFields', {
      types: {
        enabled: true,
        optionalFields: true
      }
    });
  });
  it('fieldsRequired', () => {
    parseAndSnap('types/fieldsRequired', {
        types: {
          enabled: true,
          optionalFields: false
        }
    });
  });
  it('wrapped', () => {
    parseAndSnap('types/wrapped', {
        types: {
          enabled: true,
          enumsSource: 'my-enums.ts',
          filename: 'types.ts',
          wrapped: {
            enabled: true,
            filename: 'wrapped.ts',
            enumsSource: 'my-enums.ts'
          }
        }
    });
  });
});
