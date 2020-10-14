import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Comparison, Emphasized, Heading } from 'src/components/text';
import { Box, Button, Drawer, Inline, Panel, Stack, Tag, Text } from 'src/components/matchbox';
import { Tabs, Loading } from 'src/components';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { selectFeatureFlaggedMetrics } from 'src/selectors/metrics';
import { parseSearchNew as parseSearch } from 'src/helpers/reports';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import styles from './ReportOptions.module.scss';
import MetricsDrawer from './MetricsDrawer';
import { Legend } from './index';
import AddFiltersSection from './AddFiltersSection';
import FiltersForm from './FiltersForm';
import SavedReportsSection from './SavedReportsSection';
import DateTimeSection from './DateTimeSection';
import useRouter from 'src/hooks/useRouter';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { dehydrateFilters, getIterableFormattedGroupings, getGroupingFields } from '../helpers';

const drawerTabs = [{ content: 'Metrics' }, { content: 'Filters' }];
export function ReportOptions(props) {
  const { reportLoading, isComparatorsEnabled, selectedReport, setReport } = props;

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
        </Inline>

        <Drawer {...getDrawerProps()} portalId="drawer-portal">
          <Drawer.Header showCloseButton />
          <Drawer.Content p="0">
            <Tabs defaultTabIndex={drawerTab} forceRender fitted tabs={drawerTabs}>
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

export function ActiveFilters({ filters, handleFilterRemove }) {
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
}

export function ActiveFiltersV2({ filters, handleFilterRemove }) {
  const groupings = getGroupingFields(getIterableFormattedGroupings(filters));

  // TODO: Once `Inline` supports the `data-id` prop, extra <div> elements with `data-id` will no longer needed.
  // Matchbox issue: https://github.com/SparkPost/matchbox/issues/661
  return (
    <div data-id="active-filter-tags">
      <Inline space="200">
        {groupings.map((grouping, groupingIndex) => {
          return (
            <div data-id="active-filter-group">
              <Inline
                key={`grouping-${groupingIndex}`}
                as="span"
                display="inline-flex"
                paddingY="100"
                paddingX="200"
                backgroundColor="gray.100"
                space="0"
              >
                {grouping.filters.map((filter, filterIndex) => {
                  return (
                    <Box
                      key={`filter-${groupingIndex}-${filterIndex}`}
                      paddingY="100"
                      paddingX="200"
                      backgroundColor="gray.100"
                      data-id="active-filter"
                    >
                      <Inline as="span" space="200">
                        <Text fontSize="200" as="span">
                          {filter.label}
                        </Text>

                        <Text fontWeight="500" as="span" fontSize="200">
                          <Emphasized>{filter.compareBy}</Emphasized>
                        </Text>

                        {filter.values.map((rawValue, valueIndex) => {
                          const value = typeof rawValue === 'object' ? rawValue.value : rawValue;

                          return (
                            <Tag
                              key={`tag-${groupingIndex}-${filterIndex}-${valueIndex}`}
                              onRemove={() =>
                                handleFilterRemove
                                  ? handleFilterRemove({ groupingIndex, filterIndex, valueIndex })
                                  : undefined
                              }
                            >
                              {value}
                            </Tag>
                          );
                        })}

                        {filter.hasComparisonBetweenFilters ? (
                          <Box marginX="200">
                            <Comparison>{grouping.type}</Comparison>
                          </Box>
                        ) : null}
                      </Inline>
                    </Box>
                  );
                })}

                {grouping.hasAndBetweenGroups ? (
                  <Box marginX="200">
                    <Comparison>And</Comparison>
                  </Box>
                ) : null}
              </Inline>
            </div>
          );
        })}
      </Inline>
    </div>
  );
}

const mapStateToProps = state => ({
  featureFlaggedMetrics: selectFeatureFlaggedMetrics(state),
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
  isComparatorsEnabled: selectCondition(isAccountUiOptionSet('allow_report_filters_v2'))(state),
});

export default connect(mapStateToProps)(ReportOptions);
