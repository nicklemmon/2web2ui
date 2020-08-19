import _ from 'lodash';
import { createSelector } from 'reselect';
import { formatDateTime } from '../helpers/date';
import { getFormSpec } from 'src/pages/alerts/helpers/alertForm';
import { DEFAULT_FORM_VALUES } from 'src/pages/alerts/constants/formConstants';
import { tagAsCopy } from 'src/helpers/string';
import { hasAccountOptionEnabled, isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { selectCondition } from 'src/selectors/accessConditionState';

const getAlertsList = state => state.alerts.list;
const getAlert = state => state.alerts.alert;
const getIsDuplicate = (state, props) => props.isDuplicate;

export const selectAlertsList = createSelector([getAlertsList], alerts =>
  alerts.map(alert => ({
    ...alert,
    last_triggered_timestamp: alert.last_triggered ? Date.parse(alert.last_triggered) : 0,
    last_triggered_formatted: alert.last_triggered ? formatDateTime(alert.last_triggered) : null,
  })),
);

export const selectRecentlyTriggeredAlerts = createSelector([selectAlertsList], alerts =>
  alerts
    .filter(alert => alert.muted === false && alert.last_triggered !== null) //Remove any alert that is not muted and has never triggered
    .sort((a, b) => b.last_triggered_timestamp - a.last_triggered_timestamp) //Sorts by last triggered date, descending
    .slice(0, 4),
);

export const selectAlertFormValues = createSelector(
  [getAlert, getIsDuplicate],
  (alert = {}, isDuplicate) => {
    const keysToOmit = [
      'filters',
      'any_subaccount',
      'threshold_evaluator',
      'channels',
      'last_triggered',
    ];

    const {
      metric,
      filters = [],
      any_subaccount,
      subaccounts,
      threshold_evaluator = {},
      channels = {},
    } = alert;

    const { filterType } = getFormSpec(metric);
    const getFormFilters = {
      single: () => (filters.length > 0 ? { single_filter: filters[0] } : {}),
      multi: () => {
        const formFilters = {};
        filters.forEach(filter => {
          formFilters[filter.filter_type] =
            metric === 'blacklist' || metric === 'blocklist'
              ? filter.filter_values.filter(value => value !== 'any')
              : filter.filter_values;
        });
        return formFilters;
      },
      default: () => {},
    };
    const formFilters = (getFormFilters[filterType] || getFormFilters.default)();

    const { source, operator, value } = threshold_evaluator;

    const emails = (channels.emails || []).join(', ');
    const slack = _.get(channels, 'slack.target', '');
    const webhook = _.get(channels, 'webhook.target', '');

    const name = isDuplicate ? tagAsCopy(alert.name) : alert.name;

    const keysToChange = {
      name,
      subaccounts: any_subaccount ? [-2] : subaccounts,
      ...formFilters,
      source,
      operator,
      value,
      emails,
      slack,
      webhook,
    };

    return _.omit({ ...DEFAULT_FORM_VALUES, ...alert, ...keysToChange }, keysToOmit);
  },
);

export const selectFeatureFlaggedAlerts = createSelector(
  [
    selectCondition(isAccountUiOptionSet('allow_injection_alerts')),
    selectCondition(hasAccountOptionEnabled('blacklist_monitors')),
    selectCondition(hasAccountOptionEnabled('blocklist_monitors')),
    // add more alert metric feature flags here
  ],
  (injection_count, blacklist, blocklist) => ({ blacklist, blocklist, injection_count }),
);
