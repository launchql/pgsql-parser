import { parseAndSnap } from '../test-utils';

describe('utils', () => {
  it('astHelpers enabled', () => {
    parseAndSnap('utils/astHelpers/enabled', {
      utils: {
        astHelpers: {
          enabled: true
        },
        enums: {
          enabled: true
        }
      }
    });
  });

  it('astHelpers with inlineNestedObj', () => {
    parseAndSnap('utils/astHelpers/inlineNestedObj', {
      enums: {
        enabled: true
      },
      types: {
        enabled: true,
        wrapped: {
          enabled: true
        }
      },
      utils: {
        astHelpers: {
          enabled: true,
          inlineNestedObj: true,
          nestedObjFile: 'path-obj.ts'
        },
        enums: {
          enabled: true
        }
      }
    });
  });
});
