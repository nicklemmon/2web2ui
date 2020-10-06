import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { Error } from '@sparkpost/matchbox-icons';
import { refreshReportBuilder } from 'src/actions/summaryChart';
import { Page, Panel } from 'src/components/matchbox';
import { Empty, Loading, Unit, LegendCircle } from 'src/components';
import { Button, Box, Grid, Inline, Tooltip } from 'src/components/matchbox';
import { Definition } from 'src/components/text';
import { ReportOptions, ReportTable, SaveReportModal } from './components';
import Charts from './components/Charts';
import {
  bounceTabMetrics,
  rejectionTabMetrics,
  delayTabMetrics,
  linksTabMetrics,
} from 'src/config/metrics';
import { Tabs } from 'src/components';
import {
  BounceReasonsTable,
  DelayReasonsTable,
  LinksTable,
  RejectionReasonsTable,
} from './components/tabs';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import styles from './ReportBuilder.module.scss';
import { getSubscription } from 'src/actions/billing';
import { useReportBuilderContext } from './context/ReportBuilderContext';

const MetricDefinition = ({ label, children }) => {
  return (
    <Definition>
      <Definition.Label>
        <Box color={tokens.color_gray_600}>{label}</Box>
      </Definition.Label>
      <Definition.Value>
        <Box color={tokens.color_white}>{children}</Box>
      </Definition.Value>
    </Definition>
  );
};

export function ReportBuilder({
  chart,
  isSavedReportsEnabled,
  getSubscription,
  refreshReportBuilder,
  subscription,
}) {
  const [showTable, setShowTable] = useState(true);
  const [showSaveNewReportModal, setShowSaveNewReportModal] = useState(false);

  const { state: reportOptions, selectors } = useReportBuilderContext();
  const processedMetrics = selectors.selectSummaryMetricsProcessed;
  const summarySearchOptions = selectors.selectSummaryChartSearchOptions || {};

  const isEmpty = useMemo(() => {
    return !Boolean(reportOptions.metrics && reportOptions.metrics.length);
  }, [reportOptions.metrics]);

  useEffect(() => {
    if (reportOptions.isReady && !isEmpty) {
      refreshReportBuilder(reportOptions);
    }
  }, [refreshReportBuilder, reportOptions, isEmpty]);

  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

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

  const renderLoading = () => {
    if (chart.chartLoading) {
      return (
        <div className={styles.Loading}>
          <Loading />
        </div>
      );
    }
  };

  const { to, from } = summarySearchOptions;
  const dateValue = `${moment(from).format('MMM Do')} - ${moment(to).format('MMM Do, YYYY')}`;

  return (
    <Page
      title="Analytics Report"
      primaryArea={
        isSavedReportsEnabled && (
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
        )
      }
    >
      <Panel>
        <ReportOptions reportLoading={chart.chartLoading} searchOptions={summarySearchOptions} />
        {isEmpty ? (
          <Empty message="No Data" description="Must select at least one metric." />
        ) : (
          <>
            <hr className={styles.Line} />
            <div data-id="summary-chart">
              <Tabs defaultTabIndex={0} forceRender tabs={tabs}>
                <Tabs.Item>
                  <Panel.Section className={styles.ChartSection}>
                    <Charts {...chart} metrics={processedMetrics} to={to} yScale="linear" />
                  </Panel.Section>
                  <Box padding="400" backgroundColor={tokens.color_gray_1000}>
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
                        </Inline>
                      </Grid.Column>
                    </Grid>
                  </Box>
                  {renderLoading()}
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
      {isSavedReportsEnabled && (
        <SaveReportModal
          create
          open={showSaveNewReportModal}
          onCancel={() => setShowSaveNewReportModal(false)}
        />
      )}
    </Page>
  );
}

//Redux
const mapStateToProps = state => ({
  chart: state.summaryChart,
  isSavedReportsEnabled: selectCondition(isUserUiOptionSet('allow_saved_reports'))(state),
  subscription: state.billing.subscription,
});

const mapDispatchToProps = {
  refreshReportBuilder,
  getSubscription,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilder);
