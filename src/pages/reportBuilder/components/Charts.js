import React, { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { getLineChartFormatters } from 'src/helpers/chart';
import LineChart from './LineChart';
import METRICS_UNIT_CONFIG from 'src/config/metrics-units';
import { Box, Stack, Panel } from 'src/components/matchbox';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { useSparkPostQuery } from 'src/hooks';
import { getTimeSeries } from 'src/helpers/api';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
  transformData,
  FILTER_KEY_MAP,
} from 'src/helpers/metrics';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { Heading } from 'src/components/text';
const DEFAULT_UNIT = 'number';

function getUniqueUnits(metrics) {
  return _.uniq(metrics.map(({ unit = DEFAULT_UNIT }) => unit));
}

export default function ChartContainer() {
  const { state: reportOptions } = useReportBuilderContext();
  return <ChartGroups reportOptions={reportOptions} />;
}

export function ChartGroups(props) {
  const { reportOptions } = props;
  const { compare } = reportOptions;

  if (!compare.length) {
    return (
      <Panel.Section>
        <Charts reportOptions={reportOptions} />
      </Panel.Section>
    );
  }

  return (
    <>
      {compare.map((compareFilter, index) => {
        const filterType = FILTER_KEY_MAP[compareFilter.type];
        const newFilters = [
          ...reportOptions.filters,
          { AND: { [filterType]: { eq: [compareFilter] } } },
        ];
        return (
          <Panel.Section>
            <Box key={`chart_group_${index}`}>
              <Heading data-id={`heading_${index}`} as="h2" looksLike="h5">
                {compareFilter.value}
              </Heading>
              <Charts
                key={`chart_group_${index}`}
                reportOptions={{ ...reportOptions, filters: newFilters }}
              />
            </Box>
          </Panel.Section>
        );
      })}
    </>
  );
}

export function Charts(props) {
  const { reportOptions } = props;
  const { compare, metrics } = reportOptions;

  const formattedMetrics = useMemo(() => {
    return getMetricsFromKeys(metrics, true);
  }, [metrics]);
  const formattedOptions = useMemo(() => {
    return getQueryFromOptions({ ...reportOptions, metrics: formattedMetrics });
  }, [reportOptions, formattedMetrics]);
  const { precision, to } = formattedOptions;

  const { data: rawChartData, status: chartStatus, refetch: refetchTimeSeries } = useSparkPostQuery(
    () => {
      return getTimeSeries(formattedOptions);
    },
    { enabled: reportOptions.isReady, refetchOnWindowFocus: false, initialData: [] },
  );

  useEffect(() => {
    if (reportOptions.isReady) {
      refetchTimeSeries();
    }
  }, [reportOptions.isReady, refetchTimeSeries]);

  const chartData = useMemo(() => {
    return transformData(rawChartData, formattedMetrics);
  }, [rawChartData, formattedMetrics]);

  // Keeps track of hovered chart for Tooltip
  const [activeChart, setActiveChart] = React.useState(null);

  if (!chartData.length || !formattedMetrics) {
    return null;
  }

  const formatters = getLineChartFormatters(precision, to);
  //Separates the metrics into their appropriate charts
  const charts = getUniqueUnits(formattedMetrics).map(unit => ({
    metrics: formattedMetrics.filter(metric => metric.unit === unit),
    ...METRICS_UNIT_CONFIG[unit],
  }));
  let height = 150;

  switch (charts.length * (compare.length || 1)) {
    case 1:
      height = 400;
      break;
    case 2:
      height = 200;
      break;
    default:
      break;
  }

  return (
    <Stack>
      {charts.map((chart, i) => (
        <Box key={`chart-${i}`} onMouseOver={() => setActiveChart(i)}>
          <LineChart
            height={height}
            syncId="summaryChart"
            data={chartData}
            precision={precision}
            showTooltip={activeChart === i}
            lines={chart.metrics.map(({ name, label, stroke }) => ({
              key: name,
              dataKey: name,
              name: label,
              stroke: chartStatus === 'loading' ? tokens.color_gray_100 : stroke,
            }))}
            {...formatters}
            yTickFormatter={chart.yAxisFormatter}
            yLabel={chart.label}
            tooltipValueFormatter={chart.yAxisFormatter}
            showXAxis={i === charts.length - 1}
          />
        </Box>
      ))}
    </Stack>
  );
}
