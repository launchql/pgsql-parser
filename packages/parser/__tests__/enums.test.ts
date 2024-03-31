import { parseAndSnap } from '../test-utils';

describe('pure enums', () => {
  it('enums', () => {
    parseAndSnap('pure-enums', {
      enums: {
        enabled: true,
        enumsAsTypeUnion: false,
        removeUndefinedAt0: false
      }
    });
  })

  it('removeAt0', () => {
    parseAndSnap('pure-enums-rm0', {
      enums: {
        enabled: true,
        enumsAsTypeUnion: false,
        removeUndefinedAt0: true
      }
    });
  })
})

describe('typeUnion', () => {
  it('enums', () => {
    parseAndSnap('str-enums', {
      enums: {
        enabled: true,
        enumsAsTypeUnion: true,
        removeUndefinedAt0: false
      }
    });
  })
  it('removeAt0', () => {
    parseAndSnap('str-enums-rm0', {
      enums: {
        enabled: true,
        enumsAsTypeUnion: true,
        removeUndefinedAt0: true
      }
    });
  })
})


