import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Error } from '@sparkpost/matchbox-icons';
import { refreshReportBuilder } from 'src/actions/summaryChart';
import { list as getSubaccountsList } from 'src/actions/subaccounts';
import { getReports } from 'src/actions/reports';
import { Empty, Tabs, Loading, Unit, LegendCircle } from 'src/components';
import { ExternalLink } from 'src/components/links';
import {
  Box,
  Button,
  Grid,
  LabelValue,
  Inline,
  Page,
  Panel,
  Tooltip,
} from 'src/components/matchbox';
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
import { useQuery } from 'react-query';
import _ from 'lodash';

const getOtherData = (_key, from, to) => {
  const formatDate = date =>
    moment(date)
      .utc()
      .format('YYYYMMDDHH0000');
  const formattedFrom = formatDate(from);
  const formattedTo = formatDate(to);
  return fetch(
    `http://v4-api.qa3.emailanalyst.com/v4/inbox/deliverability/total/boxbe.com?qd=between%3A${formattedFrom}%2C${formattedTo}&Authorization=c16b05b132524b5ba7a6310a239f2305`,
  )
    .then(res => res.json())
    .then(data => {
      return data.result;
    });
};

const MetricDefinition = ({ label, children }) => {
  return (
    <LabelValue>
      <LabelValue.Label>
        <Box color="gray.600">{label}</Box>
      </LabelValue.Label>
      <LabelValue.Value>
        <Box color="white">{children}</Box>
      </LabelValue.Value>
    </LabelValue>
  );
};

export function ReportBuilder({
  chart,
  getSubscription,
  refreshReportBuilder,
  subscription,
  reports,
  reportsStatus,
  getReports,
  getSubaccountsList,
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
  const { from, to } = summarySearchOptions;
  // Other time series
  const { data: inboxRateValue } = useQuery(['getInboxTotal', from, to], getOtherData, {
    enabled: reportOptions.isReady,
  });
  const isEmpty = useMemo(() => {
    return !Boolean(reportOptions.metrics && reportOptions.metrics.length);
  }, [reportOptions.metrics]);

  useEffect(() => {
    if (reportOptions.isReady && !isEmpty) {
      refreshReportBuilder({
        ...reportOptions,
        filters: reportOptions.filters,
      });
    }
  }, [refreshReportBuilder, reportOptions, isEmpty]);

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

  const dateValue = `${moment(from).format('MMM Do')} - ${moment(to).format('MMM Do, YYYY')}`;

  if (!reportOptions.isReady) {
    return <Loading />;
  }

  const formatDate = date =>
    moment(date)
      .utc()
      .format('YYYY-MM-DD');
  const formattedTo = formatDate(to);
  const formattedFrom = formatDate(from);
  const domains = reportOptions.filters[0]?.['AND'].sending_domains?.eq?.map(({ value }) => value);
  const analystLink = `https://app.emailanalyst.com/bin/#/inbox/dashboard?${
    domains ? `domains=${domains.join(',')}` : ''
  }&startDate=${formattedFrom}&endDate=${formattedTo}`;

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
                  <Box padding="400" backgroundColor="gray.1000">
                    <Box mb="500">
                      <Grid>
                        <Grid.Column sm={3}>
                          <Box id="date">
                            <MetricDefinition label="Date">
                              <Unit value={dateValue} />
                            </MetricDefinition>
                          </Box>
                        </Grid.Column>
                        <Grid.Column sm={9}>
                          <Inline space="600">
                            {chart.aggregateData.map(({ key, label, value, unit }) => {
                              const stroke = processedMetrics.find(({ key: newKey }) => {
                                return newKey === key;
                              })?.stroke;
                              return (
                                <Box marginRight="600" key={key}>
                                  <MetricDefinition label={label}>
                                    <Box display="flex" alignItems="center">
                                      {stroke && <LegendCircle marginRight="200" color={stroke} />}
                                      <Unit value={value} unit={unit} />
                                    </Box>
                                  </MetricDefinition>
                                </Box>
                              );
                            })}
                            {reportOptions.inboxRate && (
                              <Box marginRight="600">
                                <MetricDefinition label={'Inbox Rate'}>
                                  <Box display="flex" alignItems="center">
                                    <LegendCircle marginRight="200" color="#fa6423" />
                                    <Unit value={inboxRateValue * 100} unit={'percent'} />
                                  </Box>
                                </MetricDefinition>
                              </Box>
                            )}
                          </Inline>
                        </Grid.Column>
                      </Grid>
                    </Box>
                    <Box maxWidth="1000">
                      <LabelValue>
                        <LabelValue.Label>
                          <Box color="gray.600">Recommendations</Box>
                        </LabelValue.Label>
                        <LabelValue.Value>
                          <Box font-weight="600" fontSize="" color="white">
                            Inbox Insights
                          </Box>
                          <Box mb="200" fontSize="100" color="white">
                            Dive deeper into your deliverability metrics to optimize your sending.
                          </Box>
                          <Box>
                            <ExternalLink
                              as={Button}
                              to={analystLink}
                              variant="dark-mode"
                              size="small"
                              showIcon={false}
                            >
                              Inbox Tracker
                            </ExternalLink>
                          </Box>
                        </LabelValue.Value>
                      </LabelValue>
                    </Box>
                  </Box>
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
  refreshReportBuilder,
  getSubscription,
  getReports,
  getSubaccountsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilder);
