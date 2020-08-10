import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { refreshReportOptions } from 'src/actions/reportOptions';
import { Heading } from 'src/components/text';
import { Button, Drawer, Inline, Panel, Stack, Tag } from 'src/components/matchbox';
import { Tabs } from 'src/components';

import { selectFeatureFlaggedMetrics } from 'src/selectors/metrics';
import { selectSummaryMetricsProcessed } from 'src/selectors/reportSearchOptions';
import { parseSearch } from 'src/helpers/reports';
import styles from './ReportOptions.module.scss';
import MetricsDrawer from './MetricsDrawer';
import { Legend } from './index';
import _ from 'lodash';
import AddFiltersSection from './AddFiltersSection';
import SavedReportsTypeahead from './SavedReportsTypeahead';
import DateTimeSection from './DateTimeSection';
import useRouter from 'src/hooks/useRouter';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';

const drawerTabs = [{ content: 'Metrics' }, { content: 'Filters' }];
export function ReportOptions(props) {
  const {
    processedMetrics,
    refreshReportOptions,
    reportOptions,
    reportLoading,
    searchOptions,
  } = props;
  const [selectedReport, setReport] = useState(undefined);

  const { location, updateRoute } = useRouter();
  const handleReportChange = report => {
    //If user presses escape in typeahead, clears report. Keeps current active report options.
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
    updateRoute(searchOptions);
  }, [searchOptions, updateRoute]);

  //Initializes the report options with the search
  useEffect(() => {
    const { options, filters = [], report: reportKey } = parseSearch(location.search);
    const report = PRESET_REPORT_CONFIGS.find(({ key }) => key === reportKey);

    if (report) {
      const { options: reportOptions, filters: reportFilters = [] } = parseSearch(
        report.query_string,
      );
      setReport(report);
      refreshReportOptions({ ...reportOptions, filters: reportFilters });
    } else {
      refreshReportOptions({ ...options, filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getActivatorProps, getDrawerProps, openDrawer, closeDrawer } = Drawer.useDrawer({
    id: 'report-drawer',
  });
  const [drawerTab, setDrawerTab] = useState(0);
  const handleDrawerOpen = index => {
    setDrawerTab(index);
    openDrawer();
  };

  const handleFilterRemove = index => {
    const filters = [
      ...reportOptions.filters.slice(0, index),
      ...reportOptions.filters.slice(index + 1),
    ];
    refreshReportOptions({ filters });
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

  const ActiveFilters = () => {
    const filtersWithIndex = reportOptions.filters.map((value, index) => ({ ...value, index }));
    const groupedFilters = _.groupBy(filtersWithIndex, 'type');

    return (
      <Inline>
        <Heading as="h2" looksLike="h5">
          Filters
        </Heading>
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
                    onRemove={() => handleFilterRemove(index)}
                  >
                    {value}
                  </Tag>
                ))}
              </div>
            </Inline>
          ))}
        </Stack>
      </Inline>
    );
  };

  return (
    <div data-id="report-options">
      <Panel.Section>
        <SavedReportsTypeahead
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
          <Button {...getActivatorProps()} onClick={() => handleDrawerOpen(1)} variant="secondary">
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
      </Panel.Section>
      {!isEmpty && (
        <Panel.Section>
          <Legend metrics={processedMetrics} removeMetric={handleRemoveMetric} />
        </Panel.Section>
      )}
      {!isEmpty &&
      Boolean(reportOptions.filters.length) && ( //Only show if there are active filters
          <Panel.Section>
            <ActiveFilters />
          </Panel.Section>
        )}
    </div>
  );
}

const mapStateToProps = state => ({
  processedMetrics: selectSummaryMetricsProcessed(state),
  reportOptions: state.reportOptions,
  featureFlaggedMetrics: selectFeatureFlaggedMetrics(state),
});

const mapDispatchToProps = {
  refreshReportOptions,
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportOptions);
