// This component is for use in the Hibana theme only!

import React from 'react';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { ComposedChart, Rectangle, ResponsiveContainer } from 'recharts';
import { Box, Text } from 'src/components/matchbox';
import styles from './LineChart.module.scss';

function LineChart({ children }) {
  return <div className={styles.ChartWrapper}>{children}</div>;
}

function Container({ children, data, height, syncId }) {
  return (
    <ResponsiveContainer width="99%" height={height}>
      <ComposedChart syncId={syncId} barCategoryGap="3%" data={data}>
        {children}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function YAxisLabel({ children }) {
  return <span className="sp-linechart-yLabel">{children}</span>;
}

function Cursor({ data, height, points: [{ x, y }], width: chartWidth }) {
  const sectionWidth = chartWidth / data.length;
  const gap = sectionWidth * 0.03;
  const width = sectionWidth - gap * 2;

  return (
    <Rectangle x={x - width / 2} y={y} height={height} width={width} fill={tokens.color_gray_400} />
  );
}

function CustomTooltip({
  showTooltip = true,
  payload,
  label,
  labelFormatter = noop,
  nameFormatter = noop,
  formatter = noop,
}) {
  if (!showTooltip) {
    return null;
  }

  return (
    <Box borderRadius="200" padding="200" bg="gray.1000">
      <Box fontSize="100" color="gray.200" mb="100">
        {labelFormatter(label)}
      </Box>
      {payload.map(entry => (
        <Box key={`report_chart_${entry.name}`} mb="100">
          <Box justifyContent="space-between" alignItems="center" display="flex">
            <Box display="inline-flex" alignItems="center">
              <Box // The colored circle
                height="14px"
                width="14px"
                borderRadius="circle"
                mr="300"
                backgroundColor={entry.stroke}
              />
              <Text as="span" fontSize="100" color="white">
                {nameFormatter(entry.name)}
              </Text>
            </Box>
            <Box ml="800">
              <Text fontSize="100" textAlign="right" color="white">
                {formatter(entry.value)}
              </Text>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function noop(arg) {
  return arg;
}

export const lineChartConfig = {
  barProps: {
    dataKey: 'noKey',
    key: 'noKey',
    cursor: 'pointer',
    stackId: 'id',
    isAnimationActive: false,
    background: tokens.color_gray_200,
  },
  xAxisProps: {
    axisLine: false,
    scale: 'auto',
    height: 30,
    tickLine: false,
    interval: 'preserveStartEnd',
  },
  yAxisProps: {
    axisLine: false,
    tickLine: false,
    width: 30,
    minTickGap: 2,
    padding: { top: 8, bottom: 8 },
    interval: 'preserveStartEnd',
  },
  tooltipProps: {
    isAnimationActive: false,
    styles: {
      zIndex: tokens.zIndex_overlay,
    },
    wrapperStyle: {
      zIndex: tokens.zIndex_overlay,
    },
  },
  lineProps: {
    strokeWidth: 2,
    animationDuration: 400,
    activeDot: false,
    dot: false,
    type: 'linear',
    stroke: tokens.color_blue_700,
  },
  referenceLineProps: {
    strokeWidth: 1,
    strokeDasharray: '5 5',
    style: {
      stroke: tokens.color_gray_600,
    },
  },
};

YAxisLabel.displayName = 'LineChart.YAxisLabel';
Container.displayName = 'LineChart.Container';
Cursor.displayName = 'LineChart.Cursor';
CustomTooltip.displayName = 'LineChart.CustomTooltip';

LineChart.Container = Container;
LineChart.Cursor = Cursor;
LineChart.CustomTooltip = CustomTooltip;
LineChart.YAxisLabel = YAxisLabel;

export default LineChart;
