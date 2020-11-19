import React from 'react';
import { Unit } from 'src/components';
import { Definition } from 'src/components/text';
import Divider from 'src/components/divider';
import { Box, Column, Columns, Inline, Stack } from 'src/components/matchbox';

// TODO: Replace with selected request data
const AGGREGATES = [
  {
    label: 'Sending Domain',
    value: 'Sending_Domain_A',
    hasDivider: true,
    metrics: [{ value: '72%' }, { value: '22%' }, { value: '6%' }],
  },
  {
    label: 'Sending Domain',
    value: 'Sending_Domain_B',
    hasDivider: false,
    metrics: [{ value: '88%' }, { value: '10%' }, { value: '2%' }],
  },
];

export default function ChartsFooter({ date, aggregates = AGGREGATES }) {
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
            {aggregates.map((aggregate, aggregateIndex) => {
              return (
                <Stack space="300">
                  <Inline key={`aggregate-${aggregateIndex}`}>
                    <Definition dark>
                      <Definition.Label>{aggregate.label}</Definition.Label>
                      <Definition.Value>{aggregate.value}</Definition.Value>
                    </Definition>

                    {aggregate.metrics.map((metric, metricIndex) => {
                      return (
                        <AggregatedMetric key={`aggregate-${aggregateIndex}-${metricIndex}`}>
                          {metric.value}
                        </AggregatedMetric>
                      );
                    })}
                  </Inline>

                  {aggregate.hasDivider ? <Divider /> : null}
                </Stack>
              );
            })}
          </Stack>
        </Column>
      </Columns>
    </Box>
  );
}

// Extracted the component so it could make a relevant network request
function AggregatedMetric({ children }) {
  return (
    <Definition dark>
      <Definition.Label>Metric</Definition.Label>
      <Definition.Value>{children}</Definition.Value>
    </Definition>
  );
}
