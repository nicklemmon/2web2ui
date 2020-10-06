import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Heading } from 'src/components/text';
import { Button, Drawer, Inline, Panel, Stack, Tag } from 'src/components/matchbox';
import { Tabs, Loading } from 'src/components';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { AccessControl } from 'src/components/auth';
import { selectFeatureFlaggedMetrics } from 'src/selectors/metrics';
import { parseSearchNew as parseSearch } from 'src/helpers/reports';
import { not } from 'src/helpers/conditions';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import styles from './ReportOptions.module.scss';
import MetricsDrawer from './MetricsDrawer';
import { Legend } from './index';
import AddFiltersSection from './AddFiltersSection';
import FiltersForm from './FiltersForm';
import SavedReportsSection from './SavedReportsSection';
import DateTimeSection from './DateTimeSection';
import useRouter from 'src/hooks/useRouter';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';

import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { getReports } from 'src/actions/reports';

export const ActiveFilters = ({ filters, handleFilterRemove }) => {
  const filtersWithIndex = filters.map((value, index) => ({ ...value, index }));
  const groupedFilters = _.groupBy(filtersWithIndex, 'type');
  return (
    <Stack>
      {Object.keys(groupedFilters).map(key => (
        <Inline key={`filter_group_${key}`}>
          <div>{key}</div>
          <div>
            <strong className={styles.Conditional}>equals</strong>
            {groupedFilters[key].map(({ value, index }) => (
              <Tag
                className={styles.TagWrapper}
                key={`tag_${index}`}
                onRemove={handleFilterRemove ? () => handleFilterRemove(index) : undefined}
              >
                {value}
              </Tag>
            ))}
          </div>
        </Inline>
      ))}
    </Stack>
  );
};

const drawerTabs = [{ content: 'Metrics' }, { content: 'Filters' }];
export function ReportOptions(props) {
  const {
    reportLoading,
    isSavedReportsEnabled,
    isComparatorsEnabled,
    reports,
    reportsStatus,
    getReports,
  } = props;
  const [selectedReport, setReport] = useState(null);

  const { state: reportOptions, actions, selectors } = useReportBuilderContext();
  const { refreshReportOptions, removeFilter } = actions;
  const {
    selectSummaryMetricsProcessed: processedMetrics,
    selectSummaryChartSearchOptions,
  } = selectors;

  const { location, updateRoute } = useRouter();

  const isEmpty = useMemo(() => {
    return !Boolean(processedMetrics.length);
  }, [processedMetrics]);

  // Updates the query params with incoming search option changes
  useEffect(() => {
    if (reportOptions.isReady) {
      const { filters, ...update } = selectSummaryChartSearchOptions;
      if (isComparatorsEnabled) {
        update.query_filters = JSON.stringify(filters);
      } else {
        update.filters = filters;
      }

      updateRoute({ ...update, report: selectedReport?.id });
    }
  }, [
    selectSummaryChartSearchOptions,
    updateRoute,
    reportOptions.isReady,
    selectedReport,
    isComparatorsEnabled,
  ]);

  useEffect(() => {
    if (isSavedReportsEnabled) {
      getReports();
    }
  }, [isSavedReportsEnabled, getReports]);

  //Initializes the report options with the search
  useEffect(() => {
    const { report: reportId, ...options } = parseSearch(location.search);

    const allReports = [...reports, ...PRESET_REPORT_CONFIGS];
    const report = allReports.find(({ id }) => id === reportId);

    //Waiting on reports (if enabled) to initialize
    if (reportId && isSavedReportsEnabled && reportsStatus !== 'success') {
      return;
    }

    // Initializes once it finds relavant report
    if (report) {
      const { filters: reportFilters = [], ...reportOptions } = parseSearch(report.query_string);
      setReport(report);
      refreshReportOptions({ ...reportOptions, filters: [...reportFilters, ...options.filters] });
    } else {
      refreshReportOptions(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavedReportsEnabled, reportsStatus, reports]);

  const { getActivatorProps, getDrawerProps, openDrawer, closeDrawer } = Drawer.useDrawer({
    id: 'report-drawer',
  });
  const [drawerTab, setDrawerTab] = useState(0);

  const handleReportChange = report => {
    if (report) {
      const options = parseSearch(report.query_string);
      //Keep time range and filters when changing to preset report from another preset report.
      if (report.type === 'preset' && (!selectedReport || selectedReport.type === 'preset')) {
        const { from, to, relativeRange, timezone, precision, filters } = reportOptions;
        const mergedOptions = { ...options, from, to, relativeRange, timezone, precision, filters };
        refreshReportOptions(mergedOptions);
      } else {
        refreshReportOptions(options);
      }
    }
    setReport(report);
  };

  const handleDrawerOpen = index => {
    setDrawerTab(index);
    openDrawer();
  };

  const handleFilterRemove = index => {
    removeFilter(index);
  };

  const handleTimezoneSelect = useCallback(
    timezone => {
      refreshReportOptions({ timezone: timezone.value });
    },
    [refreshReportOptions],
  );

  const handleRemoveMetric = selectedMetric => {
    const updatedMetrics = reportOptions.metrics.filter(key => key !== selectedMetric);
    refreshReportOptions({ metrics: updatedMetrics });
  };

  const handleSubmit = props => {
    refreshReportOptions(props);
    closeDrawer();
  };

  if (!reportOptions.isReady) {
    return <Loading />;
  }

  return (
    <div data-id="report-options">
      <Panel.Section>
        <SavedReportsSection
          selectedItem={selectedReport}
          handleReportChange={handleReportChange}
        />
      </Panel.Section>
      <Panel.Section>
        <DateTimeSection
          reportOptions={reportOptions}
          handleTimezoneSelect={handleTimezoneSelect}
          reportLoading={reportLoading}
          refreshReportOptions={refreshReportOptions}
        />
      </Panel.Section>
      <Panel.Section>
        <Inline space="300">
          <Button {...getActivatorProps()} onClick={() => handleDrawerOpen(0)} variant="secondary">
            Add Metrics
          </Button>
          <Button
            {...getActivatorProps()}
            onClick={() => {
              handleDrawerOpen(1);
            }}
            variant="secondary"
          >
            Add Filters
          </Button>
        </Inline>
        <Drawer {...getDrawerProps()} portalId="drawer-portal">
          <Drawer.Header showCloseButton />
          <Drawer.Content p="0">
            <Tabs defaultTabIndex={drawerTab} forceRender fitted tabs={drawerTabs}>
              <Tabs.Item>
                <MetricsDrawer selectedMetrics={processedMetrics} handleSubmit={handleSubmit} />
              </Tabs.Item>
              <Tabs.Item>
                <AccessControl condition={not(isAccountUiOptionSet('allow_report_filters_v2'))}>
                  <AddFiltersSection handleSubmit={handleSubmit} reportOptions={reportOptions} />
                </AccessControl>

                <AccessControl condition={isAccountUiOptionSet('allow_report_filters_v2')}>
                  <FiltersForm handleSubmit={handleSubmit} reportOptions={reportOptions} />
                </AccessControl>
              </Tabs.Item>
            </Tabs>
          </Drawer.Content>
        </Drawer>
      </Panel.Section>
      {!isEmpty && (
        <Panel.Section>
          <Legend metrics={processedMetrics} removeMetric={handleRemoveMetric} />
        </Panel.Section>
      )}
      {!isEmpty &&
      Boolean(reportOptions.filters.length) && ( //Only show if there are active filters
          <Panel.Section>
            <Inline>
              <Heading as="h2" looksLike="h5">
                Filters
              </Heading>

              <ActiveFilters
                filters={reportOptions.filters}
                handleFilterRemove={handleFilterRemove}
              />
            </Inline>
          </Panel.Section>
        )}
    </div>
  );
}

const mapStateToProps = state => ({
  featureFlaggedMetrics: selectFeatureFlaggedMetrics(state),
  reports: state.reports.list,
  reportsStatus: state.reports.status,
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
  isComparatorsEnabled: selectCondition(isUserUiOptionSet('allow_reports_filters_v2'))(state),
});

export default connect(mapStateToProps, { getReports })(ReportOptions);
