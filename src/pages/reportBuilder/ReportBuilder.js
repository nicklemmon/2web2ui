import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { refreshSummaryReport } from 'src/actions/summaryChart';
import { Page, Panel } from 'src/components/matchbox';
import { Loading, Unit } from 'src/components';
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
import { BounceReasonsTable, DelayReasonsTable, RejectionReasonsTable } from './components/tabs';
import styles from './ReportBuilder.module.scss';
import moment from 'moment';

export function ReportBuilder({
  chart,
  processedMetrics,
  reportOptions,
  summarySearchOptions = {},
  refreshSummaryReport,
}) {
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    refreshSummaryReport(reportOptions);
  }, [refreshSummaryReport, reportOptions]);

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
  const dateLabelValue = {
    label: 'Date',
    value: `${moment(from).format('MMM Do')} - ${moment(to).format('MMM Do, YYYY')}`,
  };

  const renderAggregateMetric = useCallback(({ label, value, unit }) => {
    return (
      <Definition>
        <Definition.Label>
          <Box color={tokens.color_gray_600}>{label}</Box>
        </Definition.Label>
        <Definition.Value>
          <Box color={tokens.color_white}>
            <Unit value={value} unit={unit} />
          </Box>
        </Definition.Value>
      </Definition>
    );
  }, []);

  return (
    <Page title="Analytics Report">
      <Panel>
        <ReportOptions reportLoading={chart.chartLoading} searchOptions={summarySearchOptions} />
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
                    <Box id="date">{renderAggregateMetric(dateLabelValue)}</Box>
                  </Grid.Column>
                  <Grid.Column sm={9}>
                    <Inline space="600">
                      {chart.aggregateData.map(metric => {
                        return (
                          <Box marginRight="600" key={metric.key}>
                            {renderAggregateMetric(metric)}
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
            {hasLinksTab && <Tabs.Item></Tabs.Item>}
          </Tabs>
        </div>
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
