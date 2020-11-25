import { useEffect } from 'react';
import { getRelativeDates, getLocalTimezone } from 'src/helpers/date';
import { parseSearchNew } from 'src/helpers/reports';
import { hydrateFilters } from 'src/pages/reportBuilder/helpers';
import { PRESET_REPORT_CONFIGS } from 'src/pages/reportBuilder/constants/presetReport';
import _ from 'lodash';
import qs from 'qs';

const defaultReportName = 'Summary Report';

export default function usePinnedReport(state, actions) {
  const pinnedReport = { options: {}, name: '', linkToReportBuilder: '/' };
  const excludeOptionsFromLink = ['isReady'];
  useEffect(() => {
    if (state.onboarding === 'analytics') {
      actions.listSubaccounts();
      actions.getReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getLinktoReportBuilder = newParams => {
    const queryString = qs.stringify(newParams, {
      arrayFormat: 'repeat',
    });
    return `/signals/analytics?${queryString}`;
  };
  const getRelativeDateRange = ({ relativeRange, precision }) => {
    const { from, to } = getRelativeDates(relativeRange, {
      precision: precision,
    });
    return { from, to };
  };
  const reportOptionsWithDates = reportOptions => {
    return {
      ...reportOptions,
      ...getRelativeDateRange(reportOptions),
    };
  };
  const report = _.find(state.reports, { id: state.pinnedReportId });
  if (!report) {
    let summaryReportOptions = parseSearchNew(
      PRESET_REPORT_CONFIGS.find(x => x.name === defaultReportName).query_string,
    );
    pinnedReport.name = defaultReportName;
    pinnedReport.options = reportOptionsWithDates({
      timezone: getLocalTimezone(),
      metrics: summaryReportOptions.metrics,
      comparisons: [],
      relativeRange: '7days',
      precision: 'hour',
      isReady: true,
      filters: hydrateFilters(summaryReportOptions.filters, { subaccounts: state.subaccounts }),
    });
    pinnedReport.linkToReportBuilder = getLinktoReportBuilder(
      _.omitBy(pinnedReport.options, (_value, key) => excludeOptionsFromLink.includes(key)),
    );
  }
  return { pinnedReport };
}
