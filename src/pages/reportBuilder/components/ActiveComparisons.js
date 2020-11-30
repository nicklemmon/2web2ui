import React from 'react';
import { Box, Inline, Text, Tag } from 'src/components/matchbox';

export default function ActiveComparisons({ comparisons, handleFilterRemove }) {
  return (
    <Box data-id="active-comparison-filters" marginTop="100">
      <Inline space="200" as="span">
        <Text fontSize="200" as="span">
          {comparisons[0]?.type}
        </Text>
        {comparisons.map((compareFilter, index) => {
          const onRemoveFn = handleFilterRemove
            ? () => {
                handleFilterRemove({ index });
              }
            : undefined;

          return <Tag onRemove={onRemoveFn}>{compareFilter.value}</Tag>;
        })}
      </Inline>
    </Box>
  );
}
