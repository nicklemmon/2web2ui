import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { Heading } from 'src/components/text';
import { Button, Drawer, Inline, Panel, Stack, Tag } from 'src/components/matchbox';
import { Tabs, Loading } from 'src/components';

import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { selectFeatureFlaggedMetrics } from 'src/selectors/metrics';
import { parseSearch } from 'src/helpers/reports';
import styles from './ReportOptions.module.scss';
import MetricsDrawer from './MetricsDrawer';
import { Legend } from './index';
import _ from 'lodash';
import AddFiltersSection from './AddFiltersSection';
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
  const { reportLoading, isSavedReportsEnabled, reports, reportsStatus, getReports } = props;
  const [selectedReport, setReport] = useState(null);

  const { state: reportOptions, actions, selectors } = useReportBuilderContext();
  const { refreshReportOptions, removeFilter } = actions;
  const {
    selectSummaryMetricsProcessed: processedMetrics,
    selectSummaryChartSearchOptions,
  } = selectors;

  const { location, updateRoute } = useRouter();
  const handleReportChange = report => {
    if (report) {
      const { options, filters = [] } = parseSearch(report.query_string);
      //Keep time range and filters when changing to preset report from another preset report.
      if (report.type === 'preset' && (!selectedReport || selectedReport.type === 'preset')) {
        const {
          from,
          to,
          relativeRange,
          timezone,
          precision,
          filters: reportOptionsFilters,
        } = reportOptions;
        const mergedOptions = { ...options, from, to, relativeRange, timezone, precision };
        refreshReportOptions({ ...mergedOptions, filters: reportOptionsFilters });
      } else {
        refreshReportOptions({ ...options, filters });
      }
    }
    setReport(report);
  };

  const isEmpty = useMemo(() => {
    return !Boolean(processedMetrics.length);
  }, [processedMetrics]);

  // Updates the query params with incoming search option changes
  useEffect(() => {
    if (reportOptions.isReady) {
      updateRoute(selectSummaryChartSearchOptions);
    }
  }, [selectSummaryChartSearchOptions, updateRoute, reportOptions.isReady, selectedReport]);

  useEffect(() => {
    if (isSavedReportsEnabled) {
      getReports();
    }
  }, [isSavedReportsEnabled, getReports]);

  //Initializes the report options with the search
  useEffect(() => {
    const { options, filters = [], report: reportId } = parseSearch(location.search);
    const allReports = [...reports, ...PRESET_REPORT_CONFIGS];
    const report = allReports.find(({ id }) => id === reportId);

    //Waiting on reports (if enabled) to initialize
    if (reportId && isSavedReportsEnabled && reportsStatus !== 'success') {
      return;
    }

    // Initializes once it finds relavant report
    if (report) {
      const { options: reportOptions, filters: reportFilters = [] } = parseSearch(
        report.query_string,
      );
      setReport(report);
      refreshReportOptions({ ...reportOptions, filters: [...reportFilters, ...filters] });
    } else {
      refreshReportOptions({ ...options, filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSavedReportsEnabled, reportsStatus, reports]);

  const { getActivatorProps, getDrawerProps, openDrawer, closeDrawer } = Drawer.useDrawer({
    id: 'report-drawer',
  });
  const [drawerTab, setDrawerTab] = useState(0);
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
      <Panel.LEGACY.Section>
        <SavedReportsSection
          selectedItem={selectedReport}
          handleReportChange={handleReportChange}
        />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
        <DateTimeSection
          reportOptions={reportOptions}
          handleTimezoneSelect={handleTimezoneSelect}
          reportLoading={reportLoading}
          refreshReportOptions={refreshReportOptions}
        />
      </Panel.LEGACY.Section>
      <Panel.LEGACY.Section>
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
                <AddFiltersSection handleSubmit={handleSubmit} reportOptions={reportOptions} />
              </Tabs.Item>
            </Tabs>
          </Drawer.Content>
        </Drawer>
      </Panel.LEGACY.Section>
      {!isEmpty && (
        <Panel.LEGACY.Section>
          <Legend metrics={processedMetrics} removeMetric={handleRemoveMetric} />
        </Panel.LEGACY.Section>
      )}
      {!isEmpty &&
      Boolean(reportOptions.filters.length) && ( //Only show if there are active filters
          <Panel.LEGACY.Section>
            <Inline>
              <Heading as="h2" looksLike="h5">
                Filters
              </Heading>
              <ActiveFilters
                filters={reportOptions.filters}
                handleFilterRemove={handleFilterRemove}
              />
            </Inline>
          </Panel.LEGACY.Section>
        )}
    </div>
  );
}

const mapStateToProps = state => ({
  featureFlaggedMetrics: selectFeatureFlaggedMetrics(state),
  reports: state.reports.list,
  reportsStatus: state.reports.status,
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
});

export default connect(mapStateToProps, { getReports })(ReportOptions);
