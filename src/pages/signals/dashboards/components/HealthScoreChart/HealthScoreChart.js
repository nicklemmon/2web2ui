/* eslint-disable lodash/prop-shorthand */
import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { getCaretProps, getDoD } from 'src/helpers/signals';
import { selectCurrentHealthScoreDashboard } from 'src/selectors/signals';
import { Panel } from 'src/components/matchbox';
import BarChart from '../../../components/charts/barchart/BarChart';
import TooltipMetric from 'src/components/charts/TooltipMetric';
import { PanelLoading } from 'src/components';
import Callout from 'src/components/callout';
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
      <Panel.LEGACY sectioned>
        <div className={styles.Content}>
          <div className={styles.ErrorMessage}>
            <Callout title="Unable to Load Data" height="auto" children={error.message} />
          </div>
        </div>
      </Panel.LEGACY>
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

  return (
    <Panel.LEGACY sectioned title={`${formatDate(filters.from)} – ${formatDate(filters.to)}`}>
      <div className={styles.Content}>
        {noData && <Callout height="100%">Health Scores Not Available</Callout>}

        {!noData && (
          <Fragment>
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
          </Fragment>
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
            <Fragment>
              <div className={styles.Divider} />
              <div className={styles.Injections}>
                <MetricDisplay label="Injections" {...getHoverInjectionProps()} />
              </div>
              <div className={styles.DoDChange}>
                <MetricDisplay label="DoD Change" {...getHoverDoDProps()} />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Panel.LEGACY>
  );
}

const mapStateToProps = state => ({
  filters: state.signalOptions,
  ...selectCurrentHealthScoreDashboard(state),
});

export default connect(mapStateToProps, {})(HealthScoreChart);
