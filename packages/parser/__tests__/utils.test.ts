import { parseAndSnap } from '../test-utils';

it('utils', () => {
  parseAndSnap('utils', {
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

it('inline', () => {
  parseAndSnap('inline', {
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
