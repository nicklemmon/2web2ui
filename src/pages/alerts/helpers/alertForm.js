import {
  FILTERS_FRIENDLY_NAMES,
  METRICS,
  OPERATOR_FRIENDLY_NAMES,
  REALTIME_FILTERS,
  SIGNALS_FILTERS,
  SOURCE_FRIENDLY_NAMES,
  RECOMMENDED_METRIC_VALUE,
} from '../constants/formConstants';

export const getOptionsFromMap = (items, friendlyNameMap) =>
  items.map(item => ({ label: friendlyNameMap[item], value: item }));

const realtimeMetricsSpec = metric => ({
  hasFilters: true,
  filterType: 'multi',
  filterOptions: getOptionsFromMap(REALTIME_FILTERS, FILTERS_FRIENDLY_NAMES),
  sourceOptions: getOptionsFromMap(['raw'], SOURCE_FRIENDLY_NAMES),
  defaultRecommendedValue: RECOMMENDED_METRIC_VALUE[metric].raw.gt,
  defaultFieldValues: [
    { fieldName: 'source', fieldValue: 'raw' },
    { fieldName: 'operator', fieldValue: 'gt' },
  ],
});

const metricToFormSpecMap = {
  monthly_sending_limit: {
    hasFilters: false,
    filterType: null,
    filterOptions: [],
    sourceOptions: getOptionsFromMap(['raw'], SOURCE_FRIENDLY_NAMES),
    defaultRecommendedValue: RECOMMENDED_METRIC_VALUE['monthly_sending_limit'].raw.gt,
    defaultFieldValues: [
      { fieldName: 'subaccounts', fieldValue: [] },
      { fieldName: 'source', fieldValue: 'raw' },
      { fieldName: 'operator', fieldValue: 'gt' },
    ],
  },
  block_bounce_rate: realtimeMetricsSpec('block_bounce_rate'),
  hard_bounce_rate: realtimeMetricsSpec('hard_bounce_rate'),
  soft_bounce_rate: realtimeMetricsSpec('soft_bounce_rate'),
  health_score: {
    hasFilters: true,
    filterType: 'single',
    filterOptions: getOptionsFromMap(SIGNALS_FILTERS, FILTERS_FRIENDLY_NAMES),
    sourceOptions: getOptionsFromMap(
      ['raw', 'week_over_week', 'day_over_day'],
      SOURCE_FRIENDLY_NAMES,
    ),
    defaultRecommendedValue: RECOMMENDED_METRIC_VALUE['health_score'].raw.lt,
    defaultFieldValues: [
      { fieldName: 'source', fieldValue: 'raw' },
      { fieldName: 'operator', fieldValue: 'lt' },
    ],
  },
  injection_count: {
    hasFilters: false,
    filterType: null,
    filterOptions: [],
    sourceOptions: getOptionsFromMap(['raw'], SOURCE_FRIENDLY_NAMES),
    defaultFieldValues: [
      { fieldName: 'subaccounts', fieldValue: [] },
      { fieldName: 'source', fieldValue: 'raw' },
      { fieldName: 'operator', fieldValue: 'lt' },
      { fieldName: 'value', fieldValue: 100000 },
    ],
  },
  blacklist: {
    hasFilters: true,
    hideEvaluator: true,
    hideSubaccountFilter: true,
    filterType: 'multi',
    filterOptions: getOptionsFromMap(
      ['blacklist_provider', 'blacklist_resource'],
      FILTERS_FRIENDLY_NAMES,
    ),
    sourceOptions: [],
    defaultFieldValues: [
      { fieldName: 'blacklist_provider', fieldValue: [] },
      { fieldName: 'blacklist_resource', fieldValue: [] },
      { fieldName: 'subaccounts', fieldValue: [] },
    ],
  },
  blocklist: {
    hasFilters: true,
    hideEvaluator: true,
    hideSubaccountFilter: true,
    filterType: 'multi',
    filterOptions: getOptionsFromMap(
      ['blocklist_provider', 'blocklist_resource'],
      FILTERS_FRIENDLY_NAMES,
    ),
    sourceOptions: [],
    defaultFieldValues: [
      { fieldName: 'blocklist_provider', fieldValue: [] },
      { fieldName: 'blocklist_resource', fieldValue: [] },
      { fieldName: 'subaccounts', fieldValue: [] },
    ],
  },
};

export const getFormSpec = metric => {
  if (metric in METRICS) {
    return metricToFormSpecMap[metric];
  }
  return {};
};

export const getEvaluatorOptions = (metric, source) => {
  const operatorArray =
    metric === 'injection_count'
      ? ['lt']
      : metric === 'health_score' && source === 'raw'
      ? ['lt', 'gt']
      : ['gt'];
  const operatorOptions = getOptionsFromMap(operatorArray, OPERATOR_FRIENDLY_NAMES);

  const suffix =
    ['health_score', 'injection_count'].includes(metric) && source === 'raw' ? '' : '%';

  const getSliderProps = () => {
    const sourceLabels = ['week_over_week', 'day_over_day'];
    if (sourceLabels.includes(source)) {
      return { label: 'Percent Change', precision: 0 };
    } else if (source !== 'raw') {
      return { label: 'Percent Change', precision: 2 };
    } else {
      switch (metric) {
        case 'health_score':
          return { label: 'Score', precision: 1 };
        case 'monthly_sending_limit':
          return { label: 'Percent Used', precision: 0 };
        case 'block_bounce_rate':
        case 'hard_bounce_rate':
        case 'soft_bounce_rate':
          return { label: 'Bounce Percentage Above', precision: 0 };
        case 'injection_count':
          return {
            label: 'Falls Below',
            max: 1000000,
            min: 1000,
            precision: 0,
          };
      }
    }

    return {};
  };

  return { suffix, operatorOptions, sliderProps: getSliderProps() };
};
