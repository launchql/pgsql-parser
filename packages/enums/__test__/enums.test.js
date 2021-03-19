import { getEnum } from '../src';

it('getter', () => {
  expect(getEnum('OverridingKind', 0)).toEqual('OVERRIDING_NOT_SET');
  expect(getEnum('OverridingKind', 'OVERRIDING_NOT_SET')).toEqual(0);
});
