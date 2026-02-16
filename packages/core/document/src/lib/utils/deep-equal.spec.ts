import { deepEqual } from './deep-equal';

describe('deepEqual', () => {
  it('given same reference, returns true', () => {
    const attrs = {
      level: 3,
      align: 'center',
      style: { color: 'red', font: { size: 14, weight: 'bold' } },
      classes: ['intro', 'highlight'],
      visible: true,
    };

    expect(deepEqual(attrs, attrs)).toBe(true);
  });

  it('given equal objects, returns true', () => {
    const attrs1 = {
      level: 3,
      align: 'center',
      style: { color: 'red', font: { size: 14, weight: 'bold' } },
      classes: ['intro', 'highlight'],
      visible: true,
    };
    const attrs2 = {
      level: 3,
      align: 'center',
      style: { color: 'red', font: { size: 14, weight: 'bold' } },
      classes: ['intro', 'highlight'],
      visible: true,
    };

    expect(deepEqual(attrs1, attrs2)).toBe(true);
  });
});
