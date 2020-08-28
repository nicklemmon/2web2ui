import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Bar, Rectangle } from 'recharts';
import moment from 'moment';
import { tokens } from '@sparkpost/design-tokens-hibana';
import styled from 'styled-components';
import { Panel } from 'src/components/matchbox';
import BarChart from 'src/components/charts/BarChart';
import Legend from 'src/components/charts/Legend';
import { roundToPlaces } from 'src/helpers/units';
import TooltipMetric from 'src/components/charts/TooltipMetric';
import useDateHover from 'src/pages/inboxPlacement/hooks/useDateHover';
import { getInboxPlacementTrends } from 'src/actions/inboxPlacement';
import { selectTrends } from 'src/selectors/inboxPlacement';
import { Empty } from 'src/components';
import { formatApiDate } from 'src/helpers/date';
import { PanelSectionLoading } from 'src/components/loading';

const NoTransition = styled.div`
  transition: 0s;
`;

// TODO: Replace with <Box /> when the OG theme is removed
const RightAligned = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const yKeys = [
  {
    fill: tokens.color_blue_1000,
    key: 'missing',
    label: 'Missing',
  },
  {
    fill: tokens.color_blue_400,
    key: 'spam',
    label: 'Spam',
  },
  {
    fill: tokens.color_blue_600,
    key: 'inbox',
    label: 'Inbox',
  },
];

const legend = [
  ...yKeys.map(({ fill, label }) => ({ label, fill })).reverse(),
  { fill: tokens.color_white, label: 'No Tests Sent', hasBorder: true },
];

const panelHeight = '280px';

const yAxisProps = {
  tickFormatter: tick => `${roundToPlaces(tick * 100, 0)}%`,
  domain: [0, 1],
  ticks: [0, 0.25, 0.5, 0.75, 1.0],
};

const getTooltipContent = ({ payload = {} }) => (
  <>
    <TooltipMetric label="Total Messages" value={payload.totalMessages} />
    {yKeys
      .map(({ fill, label, key }) => (
        <TooltipMetric
          key={key}
          color={fill}
          label={label}
          value={`${(payload[key] * 100).toFixed(0)}%`}
        />
      ))
      .reverse()}
  </>
);

export const TrendsChart = props => {
  const [hoveredDate, handleDateHover, resetDateHover] = useDateHover();
  const { getInboxPlacementTrends, trends, hasNoData, loading, error, filters = {} } = props;

  useEffect(() => {
    const {
      dateRange: { from, to },
      tags,
    } = filters;

    getInboxPlacementTrends({
      from: formatApiDate(from),
      to: formatApiDate(to),
      ...Object.keys(tags).reduce((acc, curr) => {
        if (tags[curr]) {
          acc[curr] = tags[curr];
        }
        return acc;
      }, {}),
    });
  }, [getInboxPlacementTrends, filters]);

  const xAxisProps = useMemo(() => {
    const interval = Math.floor(trends.length / 10);
    const xTicks = trends.filter((value, index) => index % interval === 0).map(({ date }) => date);
    return {
      ticks: xTicks,
      tickFormatter: tick => moment(tick).format('M/D'),
    };
  }, [trends]);

  const barShape = props => {
    const isActiveDate = props.date === hoveredDate;
    const isOpaque = hoveredDate && !isActiveDate;
    return <NoTransition as={Rectangle} {...props} opacity={isOpaque ? 0.5 : 1} />;
  };

  const renderBars = yKeys.map(({ key, fill }) => (
    <Bar
      stackId="stack"
      key={key}
      dataKey={key}
      onMouseOver={handleDateHover}
      fill={fill}
      isAnimationActive={false}
      minPointSize={0}
      cursor="pointer"
      shape={barShape}
    />
  ));

  if (error) {
    return <Empty message="Unable to Load Trends Data" />;
  }

  if (loading) {
    return <PanelSectionLoading minHeight={panelHeight} />;
  }

  return (
    <>
      {hasNoData ? (
        <Empty message="Inbox Placement Trends Not Available" />
      ) : (
        <Panel.LEGACY.Section>
          {/* float:right doesn't work for some reason. Causes tooltip to not show when hovering bottom of chart */}
          <RightAligned>
            <Legend items={legend} />
          </RightAligned>
          <div className="LiftTooltip" onMouseOut={resetDateHover}>
            <BarChart
              gap={1}
              hasBackgroundBars={false}
              hovered={hoveredDate}
              onMouseOver={handleDateHover}
              margin={{ top: 10, left: 30, right: 10, bottom: 25 }}
              tooltipContent={getTooltipContent}
              timeSeries={trends}
              tooltipWidth="150px"
              yAxisProps={yAxisProps}
              xAxisProps={xAxisProps}
            >
              {renderBars}
            </BarChart>
          </div>
        </Panel.LEGACY.Section>
      )}
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const trends = selectTrends(state, ownProps);

  return {
    error: state.inboxPlacement.getTrendsError,
    loading: state.inboxPlacement.getTrendsPending,
    trends: trends,
    hasNoData: trends.length === 0,
  };
};

export default connect(mapStateToProps, { getInboxPlacementTrends })(TrendsChart);
