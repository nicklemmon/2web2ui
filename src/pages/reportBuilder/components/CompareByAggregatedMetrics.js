import React from 'react';
import { getTimeSeriesDeliverabilityMetrics } from 'src/helpers/api';
import { Loading, Unit } from 'src/components';
import { Definition } from 'src/components/text';
import Divider from 'src/components/divider'; // TODO: Incorporate logic
import { Box, Column, Columns, Inline, Stack } from 'src/components/matchbox';
import { useSparkPostQuery } from 'src/hooks';

// TODO: props can probably be replaced with context
export default function CompareByAggregatedMetrics({ date, comparisons }) {
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
  const formattedOptions = {}; // TODO: Use formatted options from SA-1617
  // TODO: Figure out handling `rollup` option - probably need to grab from Redux store
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
