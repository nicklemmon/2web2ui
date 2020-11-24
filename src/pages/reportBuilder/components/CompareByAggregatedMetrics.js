import React, { useMemo } from 'react';
import { getTimeSeriesDeliverabilityMetrics } from 'src/helpers/api';
import {
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import { Loading, Unit } from 'src/components';
import { Definition } from 'src/components/text';
import Divider from 'src/components/divider'; // TODO: Incorporate logic
import { Box, Column, Columns, Inline, Stack } from 'src/components/matchbox';
import { useSparkPostQuery } from 'src/hooks';
import { useReportBuilderContext } from '../context/ReportBuilderContext';

// TODO: props can probably be replaced with context
export default function CompareByAggregatedMetrics({ date }) {
  const {
    state: { comparisons },
  } = useReportBuilderContext();

  return (
    <Box padding="400" backgroundColor="gray.1000">
      <Columns>
        <Column width={1 / 5}>
          <Definition dark>
            <Definition.Label>Date</Definition.Label>

            <Definition.Value>
              <Unit value={date} />
            </Definition.Value>
          </Definition>
        </Column>

        <Column>
          <Stack space="300">
            {comparisons.map((comparison, comparisonIndex) => {
              return (
                <ComparisonRow key={`comparison-${comparisonIndex}`} comparison={comparison} />
              );
            })}
          </Stack>
        </Column>
      </Columns>
    </Box>
  );
}

function ComparisonRow({ comparison }) {
  const { state: reportOptions } = useReportBuilderContext();
  const { metrics } = reportOptions;
  // Prepares params for request
  const formattedMetrics = useMemo(() => {
    return getMetricsFromKeys(metrics, true);
  }, [metrics]);
  const formattedOptions = useMemo(() => {
    return getQueryFromOptions({ ...reportOptions, metrics: formattedMetrics });
  }, [reportOptions, formattedMetrics]);
  const { data, status } = useSparkPostQuery(
    () => getTimeSeriesDeliverabilityMetrics(formattedOptions),
    { refetchOnWindowFocus: false },
  );

  if (status === 'loading') return <Loading />;

  return (
    <Inline>
      <Definition dark>
        <Definition.Label>{comparison.label}</Definition.Label>
        <Definition.Value>{comparison.value}</Definition.Value>
      </Definition>

      {data.map((metric, metricIndex) => {
        const hasDivider = metricIndex < data.length;

        return (
          <Stack>
            <Definition dark key={`metric-${metricIndex}`}>
              <Definition.Label>{metric.label}</Definition.Label>
              <Definition.Value>{metric.value}</Definition.Value>
            </Definition>

            {hasDivider ? <Divider /> : null}
          </Stack>
        );
      })}
    </Inline>
  );
}
