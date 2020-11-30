import React, { useMemo } from 'react';
import { getDeliverabilityMetrics } from 'src/helpers/api';
import {
  getMetricFromKey,
  getMetricsFromKeys,
  getQueryFromOptionsV2 as getQueryFromOptions,
} from 'src/helpers/metrics';
import { Loading, Unit } from 'src/components';
import { Definition } from 'src/components/text';
import Divider from 'src/components/divider';
import { Box, Column, Columns, Inline, Stack } from 'src/components/matchbox';
import { useSparkPostQuery } from 'src/hooks';
import { useReportBuilderContext } from '../context/ReportBuilderContext';

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
                <ComparisonRow
                  key={`comparison-${comparisonIndex}`}
                  comparison={comparison}
                  hasDivider={comparisonIndex < comparisons.length - 1}
                />
              );
            })}
          </Stack>
        </Column>
      </Columns>
    </Box>
  );
}

function ComparisonRow({ comparison, hasDivider }) {
  const { state: reportOptions } = useReportBuilderContext();
  const { metrics, comparisonType } = reportOptions;
  // Prepares params for request
  const formattedMetrics = useMemo(() => {
    return getMetricsFromKeys(metrics, true);
  }, [metrics]);
  const formattedOptions = useMemo(() => {
    return getQueryFromOptions({
      ...reportOptions,
      metrics: formattedMetrics,
      [comparisonType]: comparison.value,
    });
  }, [reportOptions, formattedMetrics, comparisonType, comparison]);
  const { data, status } = useSparkPostQuery(() => getDeliverabilityMetrics(formattedOptions), {
    refetchOnWindowFocus: false,
  });

  if (status === 'loading') return <Loading />;

  if (status === 'error') return null;

  const aggregatedMetricsObj = data[0];
  const aggregatedMetricsKeys = Object.keys(aggregatedMetricsObj);

  return (
    <Stack>
      <Inline>
        <Definition dark>
          <Definition.Label>{comparison.type}</Definition.Label>
          <Definition.Value>{comparison.value}</Definition.Value>
        </Definition>

        {aggregatedMetricsKeys.map((metricKey, metricKeyIndex) => {
          const { label } = getMetricFromKey(metricKey);
          const value = aggregatedMetricsObj[metricKey];

          return (
            <Stack key={`metric-${metricKeyIndex}`}>
              <Definition dark>
                <Definition.Label>{label}</Definition.Label>
                <Definition.Value>{value}</Definition.Value>
              </Definition>
            </Stack>
          );
        })}
      </Inline>

      {hasDivider ? <Divider /> : null}
    </Stack>
  );
}
