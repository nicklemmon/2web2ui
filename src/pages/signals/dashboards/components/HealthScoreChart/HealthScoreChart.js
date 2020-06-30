/* eslint-disable lodash/prop-shorthand */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { Bar, Line, ReferenceLine, Tooltip, XAxis, YAxis } from 'recharts';
import { getCaretProps, getDoD } from 'src/helpers/signals';
import { selectCurrentHealthScoreDashboard } from 'src/selectors/signals';
import { Panel } from 'src/components/matchbox';
import BarChart from '../../../components/charts/barchart/BarChart';
import { LineChart, lineChartConfig } from 'src/components/charts';
import TooltipMetric from 'src/components/charts/TooltipMetric';
import { PanelLoading } from 'src/components';
import Callout from 'src/components/callout';
import { useHibana } from 'src/context/HibanaContext';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import MetricDisplay from '../MetricDisplay/MetricDisplay';
import { formatNumber, roundToPlaces } from 'src/helpers/units';
import thresholds from '../../../constants/healthScoreThresholds';
import {
  newModelLine,
  newModelMarginsHealthScore,
} from 'src/pages/signals/constants/healthScoreV2';
import { formatDate, getDateTicks } from 'src/helpers/date';
import OGStyles from './HealthScoreChart.module.scss';
import hibanaStyles from './HealthScoreChartHibana.module.scss';

export function HealthScoreChart(props) {
  const [{ isHibanaEnabled }] = useHibana();
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const [hoveredDate, setHovered] = useState(props.defaultHovered);

  function handleDateHover(props) {
    setHovered(props.date);
  }

  const { history = [], loading, error, filters } = props;
  const noData = history ? !_.some(getHealthScores()) : true;

  if (loading) {
    return <PanelLoading minHeight="407px" />;
  }

  if (error) {
    return (
      <Panel sectioned>
        <div className={styles.Content}>
          <div className={styles.ErrorMessage}>
            <Callout title="Unable to Load Data" height="auto" children={error.message} />
          </div>
        </div>
      </Panel>
    );
  }

  function getHealthScores() {
    return _.map(history, entry => entry.health_score);
  }

  function getXAxisProps() {
    const xTicks = getDateTicks(filters);
    return {
      ticks: xTicks,
      tickFormatter: tick => moment(tick).format('M/D'),
    };
  }

  function getTotalInjectionProps() {
    const injectionEntries = _.filter(history, entry => entry.injections);
    const injectionTotals = _.map(injectionEntries, entry => entry.injections);
    const sumInjectionTotals = _.sum(injectionTotals);
    return { value: _.isNil(sumInjectionTotals) ? 'n/a' : formatNumber(sumInjectionTotals) };
  }

  function getHoverInjectionProps() {
    const currentEntry = _.find(history, ['date', hoveredDate]);
    const value = currentEntry ? currentEntry.injections : null;
    return { value: _.isNil(value) ? 'n/a' : formatNumber(value) };
  }

  function getHoverDoDProps() {
    const previousDay = moment(hoveredDate)
      .subtract(1, 'day')
      .format('YYYY-MM-DD');
    const currentEntry = _.find(history, ['date', hoveredDate]);
    const prevEntry = _.find(history, ['date', previousDay]);
    const currentScore = currentEntry ? currentEntry.health_score : null;
    const prevScore = prevEntry ? prevEntry.health_score : null;
    const value = getDoD(currentScore, prevScore);
    return { value: _.isNil(value) ? 'n/a' : `${value}%`, ...getCaretProps(value) };
  }

  function getGap() {
    return history.length > 15 ? 0.2 : 1;
  }

  function getMin() {
    const min = _.min(getHealthScores());
    return { value: _.isNil(min) ? 'n/a' : min };
  }

  function getMax() {
    const max = _.max(getHealthScores());
    return { value: _.isNil(max) ? 'n/a' : max };
  }

  // function getXTicks() {
  //   const { history: data, precision } = props;
  //   let ticks;

  //   // Shows ticks every Sunday
  //   if (precision === 'day' && data.length > 15) {
  //     ticks = data.reduce((acc, { ts }) => {
  //       if (moment(ts).isoWeekday() === 7) {
  //         acc.push(ts);
  //       }
  //       return acc;
  //     }, []);
  //   }

  //   // Show ticks every 15 minutes
  //   if (precision === '1min') {
  //     ticks = data.reduce((acc, { ts }) => {
  //       if (moment(ts).minutes() % 15 === 0) {
  //         acc.push(ts);
  //       }
  //       return acc;
  //     }, []);
  //   }

  //   // Show ticks every 30 minutes
  //   if (precision === '15min') {
  //     ticks = data.reduce((acc, { ts }) => {
  //       if (moment(ts).minutes() % 30 === 0) {
  //         acc.push(ts);
  //       }
  //       return acc;
  //     }, []);
  //   }

  //   return ticks;
  // }

  return (
    <Panel sectioned title={`${formatDate(filters.from)} – ${formatDate(filters.to)}`}>
      <div className={styles.Content}>
        {noData && <Callout height="100%">Health Scores Not Available</Callout>}

        {!noData && (
          <>
            {isHibanaEnabled ? (
              <LineChart>
                <LineChart.Container height={300} data={history}>
                  <Bar key="noKey" dataKey="noKey" background={lineChartConfig.barsBackground} />

                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    height={30}
                    // hide={!showXAxis}
                    interval="preserveStartEnd"
                    scale="auto"
                    // tickFormatter={xTickFormatter}
                    tickLine={false}
                    {...getXAxisProps()}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={30}
                    minTickGap={2}
                    dataKey="health_score"
                    ticks={[0, 55, 80, 100]}
                  />

                  <Tooltip
                    cursor={<LineChart.Cursor data={history} />}
                    content={<LineChart.CustomTooltip showTooltip={true} />}
                    wrapperStyle={lineChartConfig.tooltipStyles}
                    isAnimationActive={false}
                    labelFormatter={formatDate}
                    nameFormatter={() => 'Health Score'}
                    formatter={val => val}
                  />

                  <ReferenceLine {...lineChartConfig.referenceLineProps} y={100} />

                  <ReferenceLine {...lineChartConfig.referenceLineProps} y={80} />

                  <ReferenceLine {...lineChartConfig.referenceLineProps} y={55} />

                  <Line
                    {...lineChartConfig.lineProps}
                    dataKey="health_score"
                    stroke={tokens.color_blue_700}
                  />
                </LineChart.Container>

                <LineChart.YAxisLabel></LineChart.YAxisLabel>
              </LineChart>
            ) : (
              <BarChart
                margin={newModelMarginsHealthScore}
                gap={getGap()}
                onMouseOver={handleDateHover}
                onMouseOut={() => setHovered({})}
                hovered={hoveredDate}
                timeSeries={history}
                tooltipContent={({ payload = {} }) =>
                  payload.ranking && (
                    <TooltipMetric
                      label="Health Score"
                      color={thresholds[payload.ranking].color}
                      value={`${roundToPlaces(payload.health_score, 1)}`}
                    />
                  )
                }
                yAxisRefLines={[
                  { y: 80, stroke: thresholds.good.color, strokeWidth: 1 },
                  { y: 55, stroke: thresholds.danger.color, strokeWidth: 1 },
                ]}
                xAxisRefLines={newModelLine}
                yKey="health_score"
                xAxisProps={getXAxisProps()}
                yAxisProps={{ ticks: [0, 55, 80, 100] }}
              />
            )}
          </>
        )}
        <div className={styles.Metrics}>
          <MetricDisplay
            data-id="health-score-total-injections"
            label="Total Injections"
            {...getTotalInjectionProps()}
          />
          <MetricDisplay data-id="health-score-high-value" label="High" {...getMax()} />
          <MetricDisplay data-id="health-score-low-value" label="Low" {...getMin()} />
          {typeof hoveredDate === 'string' && (
            <>
              <div className={styles.Divider} />
              <div className={styles.Injections}>
                <MetricDisplay label="Injections" {...getHoverInjectionProps()} />
              </div>
              <div className={styles.DoDChange}>
                <MetricDisplay label="DoD Change" {...getHoverDoDProps()} />
              </div>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

const mapStateToProps = state => ({
  filters: state.signalOptions,
  ...selectCurrentHealthScoreDashboard(state),
});

export default connect(mapStateToProps, {})(HealthScoreChart);
