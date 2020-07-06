import React, { Component } from 'react';
import { PageLink } from 'src/components/links';
import { Bar, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, Grid, Panel } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { OGOnlyWrapper } from 'src/components/hibana';
import { LineChart, lineChartConfig } from 'src/components/charts';
import { selectHealthScoreDetails } from 'src/selectors/signals';
import { getHealthScore, getSpamHits } from 'src/actions/signals';
import Page from './components/SignalsPage';
import BarChart from './components/charts/barchart/BarChart';
import DivergingBar from './components/charts/divergingBar/DivergingBar';
import HealthScoreActions from './components/actionContent/HealthScoreActions';
import HealthScoreLineChart from './components/HealthScoreLineChart';
import TooltipMetric from 'src/components/charts/TooltipMetric';
import DateFilter from './components/filters/DateFilter';
import {
  HEALTH_SCORE_INFO,
  HEALTH_SCORE_COMPONENT_INFO,
  INJECTIONS_INFO,
  HEALTH_SCORE_COMPONENTS,
} from './constants/info';
import withDetails from './containers/withDetails';
import withDateSelection from './containers/withDateSelection';
import { Empty } from 'src/components';
import { PanelSectionLoading } from 'src/components/loading';
import ChartHeader from './components/ChartHeader';
import { formatFullNumber, roundToPlaces, formatNumber } from 'src/helpers/units';
import moment from 'moment';
import _ from 'lodash';
import thresholds from './constants/healthScoreThresholds';
import {
  newModelLine,
  newModelMarginsHealthScore,
  newModelMarginsOther,
} from './constants/healthScoreV2';

const CHART_HEIGHT = 250;

export class HealthScorePageClassComponent extends Component {
  state = {
    selectedComponent: null,
  };

  componentDidUpdate(prevProps) {
    const { data, selectedDate } = this.props;

    const dataSetChanged = prevProps.data !== data;
    const selectedDataByDay = _.find(data, ['date', selectedDate]);

    // Select first component weight type
    if (dataSetChanged) {
      const firstComponentType = _.get(selectedDataByDay, 'weights[0].weight_type');
      this.setState({ selectedComponent: firstComponentType });
    }
  }

  handleComponentSelect = node => {
    this.setState({ selectedComponent: _.get(node, 'payload.weight_type') });
  };

  getXAxisProps = () => {
    const { xTicks } = this.props;
    return {
      ticks: xTicks,
      tickFormatter: tick => moment(tick).format('M/D'),
    };
  };

  handleTooltipValueFormatting = healthScore => {
    return roundToPlaces(healthScore * 100, 1);
  };

  renderContent = () => {
    const {
      data = [],
      handleDateSelect,
      handleDateHover,
      loading,
      gap,
      empty,
      error,
      selectedDate,
      hoveredDate,
      shouldHighlightSelected,
      resetDateHover,
      isHibanaEnabled,
    } = this.props;
    const { selectedComponent } = this.state;

    const selectedWeights = _.get(_.find(data, ['date', selectedDate]), 'weights', []);
    const selectedWeightsAreEmpty = selectedWeights.every(({ weight }) => weight === null);
    const dataForSelectedWeight = data.map(({ date, weights }) => ({
      date,
      ..._.find(weights, ['weight_type', selectedComponent]),
    }));
    const selectedDataIsZero = dataForSelectedWeight.every(
      ({ weight_value }) => !weight_value || weight_value <= 0,
    );
    let panelContent;

    if (empty) {
      panelContent = <Empty message="Insufficient data to populate this chart" />;
    }

    if (error) {
      panelContent = <Empty message="Unable to Load Data" />;
    }

    if (loading) {
      panelContent = <PanelSectionLoading minHeight="225px" />;
    }

    return (
      <OGOnlyWrapper as={Grid}>
        <OGOnlyWrapper as={Grid.Column} sm={12} md={7}>
          <Panel data-id="health-score-panel">
            <ChartHeader title="Health Score" tooltipContent={HEALTH_SCORE_INFO} />

            {panelContent || (
              <Panel.Section>
                {isHibanaEnabled ? (
                  <HealthScoreLineChart
                    data={data.map(dataPoint => {
                      return {
                        ...dataPoint,
                        health_score: dataPoint.health_score * 100,
                      };
                    })}
                    onBarMouseOver={handleDateHover}
                    tooltipFormatter={this.handleTooltipValueFormatting}
                  />
                ) : (
                  <BarChart
                    margin={newModelMarginsHealthScore}
                    gap={gap}
                    onClick={handleDateSelect}
                    onMouseOver={handleDateHover}
                    onMouseOut={resetDateHover}
                    disableHover={false}
                    shouldHighlightSelected={shouldHighlightSelected}
                    selected={selectedDate}
                    hovered={hoveredDate}
                    timeSeries={data}
                    tooltipContent={({ payload = {} }) =>
                      payload.ranking && (
                        <TooltipMetric
                          label="Health Score"
                          color={thresholds[payload.ranking].color}
                          value={`${roundToPlaces(payload.health_score * 100, 1)}`}
                        />
                      )
                    }
                    yAxisRefLines={[
                      { y: 0.8, stroke: thresholds.good.color, strokeWidth: 1 },
                      { y: 0.55, stroke: thresholds.danger.color, strokeWidth: 1 },
                    ]}
                    xAxisRefLines={newModelLine}
                    yKey="health_score"
                    yAxisProps={{
                      ticks: [0, 0.55, 0.8, 1],
                      tickFormatter: tick => parseInt(tick * 100),
                    }}
                    xAxisProps={this.getXAxisProps()}
                  />
                )}

                <ChartHeader title="Injections" tooltipContent={INJECTIONS_INFO} />

                {isHibanaEnabled ? (
                  <LineChart>
                    <LineChart.Container height={CHART_HEIGHT} data={data}>
                      <Bar {...lineChartConfig.barProps} onMouseOver={handleDateHover} />

                      <XAxis
                        {...lineChartConfig.xAxisProps}
                        {...this.getXAxisProps()}
                        dataKey="date"
                      />

                      <YAxis
                        {...lineChartConfig.yAxisProps}
                        dataKey="injections"
                        tickFormatter={tick => formatNumber(tick)}
                      />

                      <Tooltip
                        {...lineChartConfig.tooltipProps}
                        formatter={formatFullNumber}
                        cursor={<LineChart.Cursor data={data} />}
                        content={({ payload, ...props }) => (
                          <LineChart.CustomTooltip {...props} payload={payload} />
                        )}
                      />

                      <Line {...lineChartConfig.lineProps} dataKey="injections" />
                    </LineChart.Container>
                  </LineChart>
                ) : (
                  <BarChart
                    margin={newModelMarginsOther}
                    gap={gap}
                    height={190}
                    onClick={handleDateSelect}
                    onMouseOver={handleDateHover}
                    selected={selectedDate}
                    hovered={hoveredDate}
                    shouldHighlightSelected={shouldHighlightSelected}
                    onMouseOut={resetDateHover}
                    timeSeries={data}
                    tooltipContent={({ payload = {} }) => (
                      <TooltipMetric
                        label="Injections"
                        value={formatFullNumber(payload.injections)}
                      />
                    )}
                    yKey="injections"
                    yAxisProps={{
                      tickFormatter: tick => formatNumber(tick),
                    }}
                    xAxisProps={this.getXAxisProps()}
                  />
                )}

                {selectedComponent && !selectedWeightsAreEmpty && (
                  <>
                    <ChartHeader title={HEALTH_SCORE_COMPONENTS[selectedComponent].chartTitle} />

                    {isHibanaEnabled ? (
                      <LineChart>
                        <LineChart.Container height={CHART_HEIGHT} data={dataForSelectedWeight}>
                          <Bar {...lineChartConfig.barProps} onMouseOver={handleDateHover} />

                          <XAxis
                            {...lineChartConfig.xAxisProps}
                            {...this.getXAxisProps()}
                            dataKey="date"
                          />

                          <YAxis
                            {...lineChartConfig.yAxisProps}
                            domain={selectedDataIsZero ? [0, 1] : [0, 'auto']}
                            dataKey="weight_value"
                            width={35}
                            tickFormatter={tick => `${roundToPlaces(tick * 100, 3)}%`}
                          />

                          <Tooltip
                            {...lineChartConfig.tooltipProps}
                            cursor={<LineChart.Cursor data={dataForSelectedWeight} />}
                            content={({ payload, ...props }) => (
                              <LineChart.CustomTooltip
                                {...props}
                                nameFormatter={() => 'Suppression Hits'}
                                formatter={val => `${roundToPlaces(val * 100, 4)}%`}
                                payload={payload}
                              />
                            )}
                          />

                          <Line {...lineChartConfig.lineProps} dataKey="weight_value" />
                        </LineChart.Container>
                      </LineChart>
                    ) : (
                      <BarChart
                        margin={newModelMarginsOther}
                        gap={gap}
                        height={190}
                        onClick={handleDateSelect}
                        onMouseOver={handleDateHover}
                        onMouseOut={resetDateHover}
                        hovered={hoveredDate}
                        selected={selectedDate}
                        shouldHighlightSelected={shouldHighlightSelected}
                        timeSeries={dataForSelectedWeight}
                        tooltipContent={({ payload = {} }) => (
                          <TooltipMetric
                            label={HEALTH_SCORE_COMPONENTS[selectedComponent].label}
                            value={`${roundToPlaces(payload.weight_value * 100, 4)}%`}
                          />
                        )}
                        yKey="weight_value"
                        yAxisProps={{
                          tickFormatter: tick => `${roundToPlaces(tick * 100, 3)}%`,
                        }}
                        yDomain={selectedDataIsZero ? [0, 1] : [0, 'auto']}
                        xAxisProps={this.getXAxisProps()}
                      />
                    )}
                  </>
                )}
              </Panel.Section>
            )}
          </Panel>
        </OGOnlyWrapper>

        <OGOnlyWrapper as={Grid.Column} sm={12} md={5} mdOffset={0}>
          {!loading && (
            <div data-id="health-score-components">
              <Box as={Grid}>
                <Box as={Grid.Column} xs={12} md={7}>
                  <Box as={Panel}>
                    <ChartHeader
                      title="Health Score Components"
                      date={selectedDate}
                      hideLine
                      tooltipContent={HEALTH_SCORE_COMPONENT_INFO}
                    />

                    {!loading && selectedWeightsAreEmpty && (
                      <Empty message="Insufficient data to populate this chart" />
                    )}

                    {!panelContent && !selectedWeightsAreEmpty && (
                      <Panel.Section>
                        <DivergingBar
                          barHeight={280 / (selectedWeights.length || 1)}
                          data={selectedWeights}
                          xKey="weight"
                          yKey="weight_type"
                          yLabel={({ value }) => _.get(HEALTH_SCORE_COMPONENTS[value], 'label')}
                          tooltipContent={({ payload = {} }) =>
                            _.get(HEALTH_SCORE_COMPONENTS[payload.weight_type], 'info')
                          }
                          onClick={this.handleComponentSelect}
                          selected={selectedComponent}
                        />
                      </Panel.Section>
                    )}
                  </Box>
                </Box>

                <Box as={Grid.Column} xs={12} md={5}>
                  {!panelContent && (
                    <Box as={Panel}>
                      <HealthScoreActions weights={selectedWeights} date={selectedDate} />
                    </Box>
                  )}
                </Box>
              </Box>
            </div>
          )}
        </OGOnlyWrapper>
      </OGOnlyWrapper>
    );
  };

  render() {
    const { facet, facetId, subaccountId } = this.props;

    return (
      <Page
        breadcrumbAction={{
          content: 'Back to Health Score Overview',
          to: '/signals/health-score',
          component: PageLink,
        }}
        title="Health Score"
        facet={facet}
        facetId={facetId}
        subaccountId={subaccountId}
      >
        <Panel title="Health Score Trends">
          <Panel.Section>
            <Grid>
              <Grid.Column xs={12} md={5}>
                <DateFilter label="Date Range" />
              </Grid.Column>
            </Grid>
          </Panel.Section>
        </Panel>
        {this.renderContent()}
      </Page>
    );
  }
}

function HealthScorePage(props) {
  const [{ isHibanaEnabled }] = useHibana();

  return <HealthScorePageClassComponent isHibanaEnabled={isHibanaEnabled} {...props} />;
}

export default withDetails(
  withDateSelection(HealthScorePage),
  { getHealthScore, getSpamHits },
  selectHealthScoreDetails,
);
