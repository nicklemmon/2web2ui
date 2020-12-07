import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Error } from '@sparkpost/matchbox-icons';
import { _getTableDataReportBuilder as getTableData } from 'src/actions/summaryChart';
import { list as getSubaccountsList } from 'src/actions/subaccounts';
import { getReports } from 'src/actions/reports';
import { Empty, Tabs, Loading } from 'src/components';
import { Box, Button, Page, Panel, Tooltip } from 'src/components/matchbox';
import { ReportOptions, ReportTable, SaveReportModal } from './components';
import Charts from './components/Charts';
import {
  bounceTabMetrics,
  rejectionTabMetrics,
  delayTabMetrics,
  linksTabMetrics,
} from 'src/config/metrics';
import {
  BounceReasonsTable,
  DelayReasonsTable,
  LinksTable,
  RejectionReasonsTable,
} from './components/tabs';
import { getSubscription } from 'src/actions/billing';
import { useReportBuilderContext } from './context/ReportBuilderContext';
import { PRESET_REPORT_CONFIGS } from './constants/presetReport';
import { parseSearchNew as parseSearch } from 'src/helpers/reports';
import { useLocation } from 'react-router-dom';
import AggregateMetricsSection from '../../components/reportBuilder/AggregateMetricsSection';
import { getQueryFromOptionsV2, getMetricsFromKeys } from 'src/helpers/metrics';
import { getRelativeDates } from 'src/helpers/date';

export function ReportBuilder({
  chart,
  getSubscription,
  subscription,
  reports,
  reportsStatus,
  getReports,
  getSubaccountsList,
  getTableData,
  subaccountsReady,
}) {
  const [showTable, setShowTable] = useState(true); // TODO: Incorporate in to the context reducer due to state interaction
  const [selectedReport, setReport] = useState(null); // TODO: Incorporate in to the context reducer due to state interaction
  const [showSaveNewReportModal, setShowSaveNewReportModal] = useState(false); // TODO: Incorporate in to the context reducer due to state interaction
  const { state: reportOptions, selectors, actions } = useReportBuilderContext();
  const location = useLocation();
  const { refreshReportOptions } = actions;
  const processedMetrics = selectors.selectSummaryMetricsProcessed;
  const summarySearchOptions = selectors.selectSummaryChartSearchOptions || {};
  const isEmpty = useMemo(() => {
    return !Boolean(reportOptions.metrics && reportOptions.metrics.length);
  }, [reportOptions.metrics]);

  useEffect(() => {
    if (reportOptions.isReady && !isEmpty && chart.groupBy !== 'aggregate') {
      let updates = {
        ...reportOptions,
        filters: reportOptions.filters,
      };
      if (updates.metrics) {
        updates = { ...updates, metrics: getMetricsFromKeys(updates.metrics, true) };
      }

      // merge together states
      const merged = {
        ...chart,
        ...updates,
        ...getRelativeDates(updates.relativeRange, { precision: updates.precision }),
      };

      const params = getQueryFromOptionsV2(merged);

      getTableData({ params, metrics: merged.metrics });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportOptions, isEmpty, getTableData]);

  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

  useEffect(() => {
    getSubaccountsList();
  }, [getSubaccountsList]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  // Grabs report options from the URL query params (as well as report ID)
  useEffect(() => {
    const { report: reportId, ...urlOptions } = parseSearch(location.search);

    // Looks for report with report ID
    const allReports = [...reports, ...PRESET_REPORT_CONFIGS];
    const report = allReports.find(({ id }) => id === reportId);

    // Waiting on reports to load (if enabled) to finish initializing
    // Waiting on subaccounts (if using comparators) to finish initializing
    if (
      (reportId && reportsStatus !== 'success') ||
      !subaccountsReady ||
      reportOptions.isReady // Already ran once
    ) {
      return;
    }

    // If report is found from ID, consolidates reportOptions from URL and report
    if (report) {
      const reportOptions = parseSearch(report.query_string);

      setReport(report); // TODO: This needs to be incorporated in to the reducer since this causes state interaction
      refreshReportOptions({
        ...reportOptions,
        ...urlOptions,
      });
    } else {
      // Initializes w/ just URL options
      refreshReportOptions(urlOptions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportsStatus, reports, subaccountsReady]);

  const isMaxReports = useMemo(() => {
    const reportsProduct = subscription?.products?.find(({ product }) => product === 'reports');

    if (!reportsProduct) {
      return true;
    }
    const { limit, quantity = 0 } = reportsProduct;
    return quantity >= limit;
  }, [subscription]);

  const hasBounceTab = processedMetrics.some(({ key }) => {
    return bounceTabMetrics.map(({ key }) => key).includes(key);
  });
  const hasRejectionTab = processedMetrics.some(({ key }) => {
    return rejectionTabMetrics.map(({ key }) => key).includes(key);
  });
  const hasDelayTab = processedMetrics.some(({ key }) => {
    return delayTabMetrics.map(({ key }) => key).includes(key);
  });
  const hasLinksTab = processedMetrics.some(({ key }) => {
    return linksTabMetrics.map(({ key }) => key).includes(key);
  });

  const tabs = useMemo(
    () =>
      [
        { content: 'Report', onClick: () => setShowTable(true) },
        hasBounceTab && { content: 'Bounce Reason', onClick: () => setShowTable(false) },
        hasRejectionTab && { content: 'Rejection Reason', onClick: () => setShowTable(false) },
        hasDelayTab && { content: 'Delay Reason', onClick: () => setShowTable(false) },
        hasLinksTab && { content: 'Links', onClick: () => setShowTable(false) },
      ].filter(Boolean),
    [hasBounceTab, hasRejectionTab, hasDelayTab, hasLinksTab],
  );

  useEffect(() => {
    setShowTable(true);
  }, [tabs]);

  const { to, from } = summarySearchOptions;
  const dateValue = `${moment(from).format('MMM Do')} - ${moment(to).format('MMM Do, YYYY')}`;

  if (!reportOptions.isReady) {
    return <Loading />;
  }

  return (
    <Page
      title="Analytics Report"
      primaryArea={
        <Box display="flex" alignItems="center">
          {isMaxReports && (
            <Tooltip
              id="reports_limit_tooltip"
              content="Your account has reached its limit on custom saved reports. You either need to delete a report or upgrade your plan."
            >
              <div tabIndex="0" data-id="reports-limit-tooltip-icon">
                <Error color="gray.700" />
              </div>
            </Tooltip>
          )}
          <Button
            ml="300"
            disabled={isMaxReports}
            variant="primary"
            onClick={() => setShowSaveNewReportModal(true)}
          >
            Save New Report
          </Button>
        </Box>
      }
    >
      <Panel>
        <ReportOptions
          selectedReport={selectedReport}
          setReport={setReport}
          reportLoading={chart.chartLoading}
          searchOptions={summarySearchOptions}
        />
      </Panel>
      <Panel>
        {isEmpty ? (
          <Empty message="No Data" description="Must select at least one metric." />
        ) : (
          <>
            <div data-id="summary-chart">
              <Tabs defaultTabIndex={0} forceRender tabs={tabs}>
                <Tabs.Item>
                  <Charts {...chart} metrics={processedMetrics} to={to} yScale="linear" />
                  <AggregateMetricsSection
                    dateValue={dateValue}
                    processedMetrics={processedMetrics}
                    updates={{
                      ...reportOptions,
                      filters: reportOptions.filters,
                    }}
                  />
                </Tabs.Item>
                {hasBounceTab && (
                  <Tabs.Item>
                    <BounceReasonsTable />
                  </Tabs.Item>
                )}
                {hasRejectionTab && (
                  <Tabs.Item>
                    <RejectionReasonsTable />
                  </Tabs.Item>
                )}
                {hasDelayTab && (
                  <Tabs.Item>
                    <DelayReasonsTable />
                  </Tabs.Item>
                )}
                {hasLinksTab && (
                  <Tabs.Item>
                    <LinksTable />
                  </Tabs.Item>
                )}
              </Tabs>
            </div>
          </>
        )}
      </Panel>
      {showTable && (
        <div data-id="summary-table">
          <ReportTable />
        </div>
      )}
      <SaveReportModal
        create
        open={showSaveNewReportModal}
        setReport={setReport}
        onCancel={() => setShowSaveNewReportModal(false)}
      />
    </Page>
  );
}

//Redux
const mapStateToProps = state => ({
  chart: state.summaryChart,
  reports: state.reports.list,
  reportsStatus: state.reports.status,
  subaccountsReady: state.subaccounts.ready,
  subscription: state.billing.subscription,
});

const mapDispatchToProps = {
  getSubscription,
  getReports,
  getSubaccountsList,
  getTableData,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilder);
