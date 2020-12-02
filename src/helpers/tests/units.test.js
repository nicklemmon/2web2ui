import cases from 'jest-in-case';
import * as formatting from '../units';

describe('Formatting helpers', () => {
  describe('isNumber', () => {
    it('knows a number when it sees it', () => expect(formatting.isNumber(2.71)).toBeTruthy());
    it('knows a number string when it sees it', () =>
      expect(formatting.isNumber('2.71')).toBeTruthy());
    it('handles Infinity better than humans', () =>
      expect(formatting.isNumber(Infinity)).toBeTruthy());
  });

  describe('coalesce', () => {
    it('return undefined when all undefined', () => {
      expect(formatting.coalesce(undefined)).toBeUndefined();
    });

    it('return first integer', () => {
      expect(formatting.coalesce(undefined, 0)).toEqual(0);
    });

    it('return first float', () => {
      expect(formatting.coalesce(undefined, 0.5)).toEqual(0.5);
    });
  });

  describe('roundToPlaces', () => {
    it('should round to specified decimal places', () => {
      expect(formatting.roundToPlaces(2.116, 2)).toBeCloseTo(2.12);
    });
  });

  describe('formatNumber', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatNumber(iceCream)).toBe(iceCream);
    });
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatNumber(999)).toEqual((999).toLocaleString());
      expect(formatting.formatNumber(1000)).toMatch(/K$/);
      expect(formatting.formatNumber(1000 * 1000)).toMatch(/M$/);
      expect(formatting.formatNumber(1000 * 1000 * 1000)).toMatch(/B$/);
    });
  });

  describe('formatFullNumber', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatFullNumber(iceCream)).toEqual(iceCream);
    });

    it('should format floats', () => {
      expect(formatting.formatFullNumber(23456.78)).toEqual('23,456.78');
    });

    it('should format numbers', () => {
      expect(formatting.formatFullNumber(23456)).toEqual('23,456');
    });
  });

  describe('formatMilliseconds', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatMilliseconds(iceCream)).toBe(iceCream);
    });
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatMilliseconds(999)).toMatch(/ms$/);
      expect(formatting.formatMilliseconds(1000)).toMatch(/s$/);
      expect(formatting.formatMilliseconds(60000)).toMatch(/m$/);
    });
  });

  describe('formatBytes', () => {
    const kb = 1024;
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatBytes(iceCream)).toBe(iceCream);
    });
    it('should include suffixes where appropriate', () => {
      expect(formatting.formatBytes(1023)).toMatch(/B$/);
      expect(formatting.formatBytes(kb)).toMatch(/KB$/);
      expect(formatting.formatBytes(kb * kb)).toMatch(/MB$/);
      expect(formatting.formatBytes(kb * kb * kb)).toMatch(/GB$/);
      expect(formatting.formatBytes(kb * kb * kb * kb)).toMatch(/TB$/);
      expect(formatting.formatBytes(kb * kb * kb * kb * kb)).toMatch(/PB$/);
    });
  });

  describe('formatPercent', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatPercent(iceCream)).toBe(iceCream);
    });

    it('should put a % on the end', () => expect(formatting.formatPercent(27.4)).toMatch(/%$/));
    it('should round percentages nicely', () =>
      expect(formatting.formatPercent(27.436)).toEqual('27.44%'));
    it('should be nice about small percentages', () =>
      expect(formatting.formatPercent(0.001)).toMatch(/<\s+0.01%$/));
    it('should be nice about large percentages', () =>
      expect(formatting.formatPercent(101)).toEqual('> 100%'));
  });

  cases(
    'formatPrecisePercent',
    ({ formatted, value }) => {
      expect(formatting.formatPrecisePercent(value)).toEqual(formatted);
    },
    {
      'with zero': {
        formatted: '0%',
        value: 0,
      },
      'with whole number': {
        formatted: '12%',
        value: 12,
      },
      'with short decimal': {
        formatted: '0.01%',
        value: 0.01,
      },
      'with long decimal': {
        formatted: '0.0001%',
        value: 0.00005,
      },
    },
  );

  describe('formatMinuteString', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatMinuteString(iceCream)).toBe(iceCream);
    });
    it('should format correctly', () => {
      expect(formatting.formatMinuteString(9)).toMatch('09');
      expect(formatting.formatMinuteString('9')).toMatch('09');
      expect(formatting.formatMinuteString(20)).toMatch('20');
      expect(formatting.formatMinuteString('20')).toMatch('20');
    });
  });

  describe('formatHourString', () => {
    it('should leave non-numbers alone', () => {
      const iceCream = 'vanilla';
      expect(formatting.formatHourString(iceCream)).toBe(iceCream);
    });
    it('should format correctly', () => {
      expect(formatting.formatHourString(9)).toMatch('9');
      expect(formatting.formatHourString('9')).toMatch('9');
      expect(formatting.formatHourString(20)).toMatch('8');
      expect(formatting.formatHourString('20')).toMatch('8');
      expect(formatting.formatHourString('0')).toMatch('12');
      expect(formatting.formatHourString('24')).toMatch('12');
    });
  });
});
