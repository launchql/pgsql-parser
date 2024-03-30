import { describe, expect, test } from '@jest/globals';
import { getEnum } from '../src';

test('getter', () => {
  expect(getEnum('OverridingKind', 0)).toEqual('OVERRIDING_NOT_SET');
  expect(getEnum('OverridingKind', 'OVERRIDING_NOT_SET')).toEqual(0);
});