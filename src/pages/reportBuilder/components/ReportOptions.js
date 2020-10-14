import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Heading } from 'src/components/text';
import { Button, Drawer, Inline, Panel } from 'src/components/matchbox';
import { Tabs, Loading } from 'src/components';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { selectFeatureFlaggedMetrics } from 'src/selectors/metrics';
import { parseSearchNew as parseSearch } from 'src/helpers/reports';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { AddFiltersSection, CompareByDrawer, FiltersForm, Legend, MetricsDrawer } from './index';
import SavedReportsSection from './SavedReportsSection';
import DateTimeSection from './DateTimeSection';
import useRouter from 'src/hooks/useRouter';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { dehydrateFilters } from '../helpers';
import { ActiveFilters, ActiveFiltersV2 } from './ActiveFilters';

const drawerTabs = [{ content: 'Metrics' }, { content: 'Filters' }];
export function ReportOptions(props) {
  const {
    reportLoading,
    isComparatorsEnabled,
    isCompareByEnabled,
    selectedReport,
    setReport,
  } = props;
  const drawerTabsFeatureFlag = isCompareByEnabled
    ? [...drawerTabs, { content: 'Compare' }]
    : drawerTabs;
  const { state: reportOptions, actions, selectors } = useReportBuilderContext();
  const { refreshReportOptions, removeFilter, removeFilterV2 } = actions;
  const {
    selectSummaryMetricsProcessed: processedMetrics,
    selectSummaryChartSearchOptions,
  } = selectors;

  const { updateRoute } = useRouter();

  const isEmpty = useMemo(() => {
    return !Boolean(processedMetrics.length);
  }, [processedMetrics]);

  // Updates the query params with incoming search option changes
  useEffect(() => {
    if (reportOptions.isReady) {
      const { filters: selectedFilters, ...update } = selectSummaryChartSearchOptions;
      const { filters } = reportOptions;
      if (isComparatorsEnabled) {
        update.query_filters = encodeURI(JSON.stringify(dehydrateFilters(filters)));
      } else {
        update.filters = selectedFilters;
      }

      updateRoute({ ...update, report: selectedReport?.id });
    }
  }, [
    selectSummaryChartSearchOptions,
    updateRoute,
    reportOptions.isReady,
    selectedReport,
    isComparatorsEnabled,
    reportOptions,
  ]);

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

  // TODO: Remove when the filter groupings feature flag is removed
  const handleFilterRemove = index => {
    removeFilter(index);
  };

  const handleFilterRemoveV2 = ({ groupingIndex, filterIndex, valueIndex }) => {
    return removeFilterV2({ groupingIndex, filterIndex, valueIndex });
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
          {isCompareByEnabled && (
            <Button
              {...getActivatorProps()}
              onClick={() => {
                handleDrawerOpen(2);
              }}
              variant="secondary"
            >
              Compare
            </Button>
          )}
        </Inline>

        <Drawer {...getDrawerProps()} portalId="drawer-portal">
          <Drawer.Header showCloseButton />
          <Drawer.Content p="0">
            <Tabs defaultTabIndex={drawerTab} forceRender fitted tabs={drawerTabsFeatureFlag}>
              <Tabs.Item>
                <MetricsDrawer selectedMetrics={processedMetrics} handleSubmit={handleSubmit} />
              </Tabs.Item>
              <Tabs.Item>
                {isComparatorsEnabled ? (
                  <FiltersForm handleSubmit={handleSubmit} reportOptions={reportOptions} />
                ) : (
                  <AddFiltersSection handleSubmit={handleSubmit} reportOptions={reportOptions} />
                )}
              </Tabs.Item>
              {isCompareByEnabled && (
                <Tabs.Item>
                  <CompareByDrawer />
                </Tabs.Item>
              )}
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
      Boolean(reportOptions.filters.length) && ( // Only show if there are active filters
          <Panel.Section>
            <Inline>
              <Heading as="h2" looksLike="h5">
                Filters
              </Heading>

              {isComparatorsEnabled ? (
                <ActiveFiltersV2
                  filters={reportOptions.filters}
                  handleFilterRemove={handleFilterRemoveV2}
                />
              ) : (
                <ActiveFilters
                  filters={reportOptions.filters}
                  handleFilterRemove={handleFilterRemove}
                />
              )}
            </Inline>
          </Panel.Section>
        )}
    </div>
  );
}

const mapStateToProps = state => ({
  featureFlaggedMetrics: selectFeatureFlaggedMetrics(state),
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
  isComparatorsEnabled: selectCondition(isAccountUiOptionSet('allow_report_filters_v2'))(state),
  isCompareByEnabled: selectCondition(isAccountUiOptionSet('allow_compare_by'))(state), //Comparing different filters
});

export default connect(mapStateToProps)(ReportOptions);
