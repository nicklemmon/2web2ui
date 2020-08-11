import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { refreshSummaryReport } from 'src/actions/summaryChart';
import { Page, Panel } from 'src/components/matchbox';
import { Empty, Loading, Unit, LegendCircle } from 'src/components';
import { Box, Grid, Inline } from 'src/components/matchbox';
import { Definition } from 'src/components/text';
import { ReportOptions, ReportTable } from './components';
import Charts from './components/Charts';

import {
  bounceTabMetrics,
  rejectionTabMetrics,
  delayTabMetrics,
  linksTabMetrics,
} from 'src/config/metrics';
import { Tabs } from 'src/components';
import {
  selectSummaryChartSearchOptions,
  selectSummaryMetricsProcessed,
} from 'src/selectors/reportSearchOptions';
import {
  BounceReasonsTable,
  DelayReasonsTable,
  LinksTable,
  RejectionReasonsTable,
} from './components/tabs';
import styles from './ReportBuilder.module.scss';
import moment from 'moment';

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
  processedMetrics,
  reportOptions,
  summarySearchOptions = {},
  refreshSummaryReport,
}) {
  const [showTable, setShowTable] = useState(true);

  const isEmpty = useMemo(() => {
    return !Boolean(reportOptions.metrics && reportOptions.metrics.length);
  }, [reportOptions.metrics]);

  useEffect(() => {
    if (reportOptions.isReady && !isEmpty) {
      refreshSummaryReport(reportOptions);
    }
  }, [refreshSummaryReport, reportOptions, isEmpty]);

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
    <Page title="Analytics Report">
      <Panel>
        <ReportOptions reportLoading={chart.chartLoading} searchOptions={summarySearchOptions} />
        {isEmpty ? (
          <Empty
            message={
              <>
                <span>No Data</span>
                <br />
                <span>Must select at least one metric.</span>
              </>
            }
          />
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
    </Page>
  );
}

//Redux
const mapStateToProps = state => ({
  chart: state.summaryChart,
  reportOptions: state.reportOptions,
  processedMetrics: selectSummaryMetricsProcessed(state),
  summarySearchOptions: selectSummaryChartSearchOptions(state),
});

const mapDispatchToProps = {
  refreshSummaryReport,
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportBuilder);
