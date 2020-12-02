import _ from 'lodash';

export const coalesce = (...values) => values.find(value => value !== undefined);
export const isNumber = value => isNaN(parseFloat(value)) === false || isFinite(value) === true;

export function roundToPlaces(number, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(number * multiplier) / multiplier;
}

// Formats bytes into a readable size value
export const formatBytes = _.memoize(value => {
  if (!isNumber(value)) {
    return value;
  }

  // Default case is Bytes
  let formatted = value;
  let suffix = 'B';

  const formatters = {
    PB: Math.pow(2, 50),
    TB: Math.pow(2, 40),
    GB: Math.pow(2, 30),
    MB: Math.pow(2, 20),
    KB: Math.pow(2, 10),
  };

  _.forEach(formatters, (unit, key) => {
    if (value >= unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${roundToPlaces(formatted, 2).toLocaleString(undefined, {
    maximumSignificantDigits: 4,
  })}${suffix}`;
});

// Formats milliseconds into a readable duration value
export const formatMilliseconds = _.memoize(value => {
  if (!isNumber(value)) {
    return value;
  }

  // Default case is milliseconds
  let formatted = value;
  let suffix = 'ms';

  const formatters = {
    h: 3600000,
    m: 60000,
    s: 1000,
  };

  _.forEach(formatters, (unit, key) => {
    if (value >= unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${roundToPlaces(formatted, 2).toLocaleString()}${suffix}`;
});

// Formats number count into a abbreviated count
export const formatNumber = _.memoize(value => {
  if (!isNumber(value)) {
    return value;
  }

  // No suffix for default case
  let formatted = value;
  let suffix = '';

  const formatters = {
    B: Math.pow(10, 9),
    M: Math.pow(10, 6),
    K: 1000,
  };

  _.forEach(formatters, (unit, key) => {
    if (value >= unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${roundToPlaces(formatted, 2).toLocaleString()}${suffix}`;
});

// Formats number count to string with commas
export const formatFullNumber = value => {
  if (!isNumber(value)) {
    return value;
  }

  return value.toLocaleString();
};

export const formatPercent = value => {
  if (!isNumber(value)) {
    return value;
  }

  let formatted = `${roundToPlaces(value, 2)}%`;

  if (value < 0.01 && value > 0) {
    formatted = '< 0.01%';
  }

  if (value > 100) {
    formatted = '> 100%';
  }

  return formatted;
};

export const formatPrecisePercent = value => {
  if (!isNumber(value)) {
    return value;
  }

  return `${roundToPlaces(value, 4)}%`;
};

export const formatCurrency = value => `$${value.toFixed(2)}`;

export const formatMinuteString = value => {
  const minute = parseInt(value);
  if (!isNumber(minute) || minute > 60) {
    return value;
  }
  return minute < 10 ? '0' + minute : minute.toString(); //prepends 0 so it's 12:09 vs 12:9
};

export const formatHourString = value => {
  const hour = parseInt(value);
  if (!isNumber(hour)) {
    return value;
  }
  return (hour % 12 || 12).toString(); //0 is falsy so it resolves to 12.
};
