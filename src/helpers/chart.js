import moment from 'moment';
import _ from 'lodash';
import { getPrecisionType } from './metrics';
import { roundToPlaces } from 'src/helpers/units';

function getDayLines(data, precision = 'day') {
  if (getPrecisionType(precision) !== 'hour') {
    return [];
  }
  const lastIndex = data.length - 1;
  return data.filter(({ ts }, i) => {
    if (i === 0 || i === lastIndex) {
      return false;
    }
    if (moment(ts).hours() !== 0) {
      return false;
    }
    return true;
  });
}

const getTimeTickFormatter = _.memoize(precisionType => {
  const format = tickFormat => tick => moment(tick).format(tickFormat);
  switch (precisionType) {
    case 'hour':
      return format('h:mma');

    case 'day':
    case 'week':
      return format('MMM Do');

    case 'month':
      return format('MMM');

    default:
      return format('MMM Do');
  }
});

const getTooltipLabelFormatter = _.memoize(precisionType => {
  const format = labelFormat => label => moment(label).format(labelFormat);
  switch (precisionType) {
    case 'hour':
      return format('MMM Do [at] LT');

    case 'day':
      return format('MMMM Do');

    case 'month':
      return format('MMMM YYYY');

    default:
      return format('MMMM Do');
  }
});

const getWeekPrecisionFormatter = to => {
  return label => {
    const format = momentTime => momentTime.format('MMM Do');
    const startDate = format(moment(label));

    //If it's the last date, make the end date the to date; else, make the to date the next Saturday
    if (moment(label).isSame(moment(to).weekday(0), 'day')) {
      return `${startDate} - ${format(moment(to))}`;
    }

    return `${startDate} - ${format(moment(label).weekday(6))}`;
  };
};

function getLineChartFormatters(precision, to = moment()) {
  const formatters = {};
  const precisionType = getPrecisionType(precision);

  formatters.xTickFormatter = getTimeTickFormatter(precisionType);
  formatters.tooltipLabelFormatter =
    precisionType === 'week' //Can't put in case;switch in getToolTipLabelFormatter b/c memoization
      ? getWeekPrecisionFormatter(to)
      : getTooltipLabelFormatter(precisionType);

  return formatters;
}

const formatYAxisPercent = _.memoize(v => `${roundToPlaces(v, v < 1 ? 3 : 1)}%`);

export {
  getDayLines,
  getTimeTickFormatter,
  getTooltipLabelFormatter,
  getWeekPrecisionFormatter,
  getLineChartFormatters,
  formatYAxisPercent,
};
