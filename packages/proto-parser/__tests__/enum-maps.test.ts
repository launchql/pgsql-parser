import { parseAndSnap } from '../test-utils';

describe('enum-maps', () => {
  it('json format enabled', () => {
    parseAndSnap('enum-maps/json/enabled', {
      enums: {
        enabled: true,
        enumMap: {
          enabled: true,
          format: 'json',
          toIntOutFile: 'enum-to-int.json',
          toStrOutFile: 'enum-to-str.json'
        }
      }
    });
  });

  it('typescript format enabled', () => {
    parseAndSnap('enum-maps/typescript/enabled', {
      enums: {
        enabled: true,
        enumMap: {
          enabled: true,
          format: 'ts',
          toIntOutFile: 'enum-to-int.ts',
          toStrOutFile: 'enum-to-str.ts'
        }
      }
    });
  });

  it('disabled enum maps', () => {
    parseAndSnap('enum-maps/disabled', {
      enums: {
        enabled: true,
        enumMap: {
          enabled: false
        }
      }
    });
  });

  it('only toIntOutFile', () => {
    parseAndSnap('enum-maps/only-int', {
      enums: {
        enabled: true,
        enumMap: {
          enabled: true,
          format: 'ts',
          toIntOutFile: 'enum-to-int.ts'
          // toStrOutFile not set
        }
      }
    });
  });

  it('only toStrOutFile', () => {
    parseAndSnap('enum-maps/only-str', {
      enums: {
        enabled: true,
        enumMap: {
          enabled: true,
          format: 'json',
          toStrOutFile: 'enum-to-str.json'
          // toIntOutFile not set
        }
      }
    });
  });
});