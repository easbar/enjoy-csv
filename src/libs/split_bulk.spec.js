import { describe, expect, test } from '@jest/globals';
import { splitBulk } from './split_bulk';

describe('split bulk', () => {
  test('kg bulks', () => {
    expect(splitBulk('25kg')).toMatchObject({
      unit: 1,
      unitStr: '1kg',
      amount: 25,
    });
    expect(splitBulk('22,68kg')).toMatchObject({
      unit: 1,
      unitStr: '1kg',
      amount: 22,
    });
    expect(splitBulk('12kg')).toMatchObject({
      unit: 0.5,
      unitStr: '500g',
      amount: 24,
    });
    expect(splitBulk('5kg')).toMatchObject({
      unit: 0.25,
      unitStr: '250g',
      amount: 20,
    });
    expect(splitBulk('2,1kg')).toMatchObject({
      unit: 0.1,
      unitStr: '100g',
      amount: 21,
    });
    expect(splitBulk('2,15kg')).toMatchObject({
      unit: 0.1,
      unitStr: '100g',
      amount: 21,
    });
    expect(splitBulk('0,9kg')).toMatchObject({
      unit: 0.05,
      unitStr: '50g',
      amount: 18,
    });
    expect(splitBulk('0,99kg')).toMatchObject({
      unit: 0.05,
      unitStr: '50g',
      amount: 19,
    });
  });

  test('multiple kg bulk sizes', () => {
    // when two values are given we ignore the second one
    expect(splitBulk('10kg/20kg')).toMatchObject({
      unit: 0.5,
      unitStr: '500g',
      amount: 20,
    });
    expect(splitBulk('5kg/9kg')).toMatchObject({
      unit: 0.25,
      unitStr: '250g',
      amount: 20,
    });
    expect(splitBulk('2,3kg/4,2kg')).toMatchObject({
      unit: 0.1,
      unitStr: '100g',
      amount: 23,
    });
  });

  test('L bulks', () => {
    expect(splitBulk('10L')).toMatchObject({
      unit: 1,
      unitStr: '1L',
      amount: 10,
    });
    expect(splitBulk('5L')).toMatchObject({
      unit: 0.5,
      unitStr: '500ml',
      amount: 10,
    });
  });

  test('batched products', () => {
    expect(splitBulk('6/400g')).toMatchObject({
      unit: 1,
      unitStr: '400g',
      amount: 6,
    });
    expect(splitBulk('8/1000g')).toMatchObject({
      unit: 1,
      unitStr: '1000g',
      amount: 8,
    });
    expect(splitBulk('6x175g')).toMatchObject({
      unit: 1,
      unitStr: '175g',
      amount: 6,
    });
    expect(splitBulk('12/250ml')).toMatchObject({
      unit: 1,
      unitStr: '250ml',
      amount: 12,
    });
    expect(splitBulk('12x250ml')).toMatchObject({
      unit: 1,
      unitStr: '250ml',
      amount: 12,
    });
    expect(splitBulk('1 Dose')).toMatchObject({
      unit: 1,
      unitStr: 'Dose',
      amount: 1,
    });
    expect(splitBulk('1Kt.')).toMatchObject({
      unit: 1,
      unitStr: 'Kt.',
      amount: 1,
    });
    expect(splitBulk('6/8stk')).toMatchObject({
      unit: 1,
      unitStr: '8stk',
      amount: 6,
    });
  });
});
