/*
  This component is meant to be loaded asynchronously, do not import directly.
  See ../LineChart.js for async export
*/

import React from 'react';
import { Bar, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { LineChart, lineChartConfig } from 'src/components/charts';
import moment from 'moment';

const identity = a => a;

function orderDesc(a, b) {
  return b.value - a.value;
}

export default function SpLineChart(props) {
  const renderLines = () => {
    const { lines = [] } = props;
    return lines.map(line => {
      const lineProps = {
        strokeWidth: 2,
        animationDuration: 400,
        activeDot: false,
        dot: false,
        type: 'linear',
        ...line,
      };
      return <Line {...lineProps} />;
    });
  };

  // Manually generates X axis ticks
  const getXTicks = () => {
    const { data, precision } = props;
    let ticks;

    // Shows ticks every Sunday
    if (precision === 'day' && data.length > 15) {
      ticks = data.reduce((acc, { ts }) => {
        if (moment(ts).isoWeekday() === 7) {
          acc.push(ts);
        }
        return acc;
      }, []);
    }

    // Show ticks every 15 minutes
    if (precision === '1min') {
      ticks = data.reduce((acc, { ts }) => {
        if (moment(ts).minutes() % 15 === 0) {
          acc.push(ts);
        }
        return acc;
      }, []);
    }

    // Show ticks every 30 minutes
    if (precision === '15min') {
      ticks = data.reduce((acc, { ts }) => {
        if (moment(ts).minutes() % 30 === 0) {
          acc.push(ts);
        }
        return acc;
      }, []);
    }

    return ticks;
  };

  const {
    data,
    height,
    syncId,
    showTooltip,
    xTickFormatter = identity,
    yTickFormatter = identity,
    yScale = 'linear',
    tooltipLabelFormatter = identity,
    tooltipValueFormatter = identity,
    showXAxis,
    yLabel,
  } = props;

  return (
    <LineChart>
      <LineChart.Container syncId={syncId} height={height} data={data}>
        <Bar key="noKey" dataKey="noKey" background={lineChartConfig.barsBackground} />

        <XAxis
          axisLine={false}
          dataKey="ts"
          height={30}
          hide={!showXAxis}
          interval="preserveStartEnd"
          scale="auto"
          tickFormatter={xTickFormatter}
          tickLine={false}
          ticks={getXTicks()}
        />

        <YAxis
          axisLine={false}
          domain={['dataMin', 'dataMax']}
          interval="preserveStartEnd"
          padding={{ top: 8, bottom: 8 }}
          scale={yScale}
          tickFormatter={yTickFormatter}
          tickLine={false}
          width={60}
        />

        <Tooltip
          cursor={<LineChart.Cursor data={data} />}
          content={<LineChart.CustomTooltip showTooltip={showTooltip} />}
          wrapperStyle={lineChartConfig.tooltipStyles}
          isAnimationActive={false}
          itemSorter={orderDesc}
          labelFormatter={tooltipLabelFormatter}
          formatter={tooltipValueFormatter}
        />

        {renderLines()}
      </LineChart.Container>

      <LineChart.YAxisLabel>{yLabel}</LineChart.YAxisLabel>
    </LineChart>
  );
}
