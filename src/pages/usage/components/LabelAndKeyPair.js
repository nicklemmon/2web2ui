import React from 'react';
import { Box, LabelValue } from 'src/components/matchbox';

export default function LabelAndKeyPair({ label, value }) {
  return (
    <LabelValue dark>
      <LabelValue.Label>
        <Box color="gray.600">{label}</Box>
      </LabelValue.Label>
      <LabelValue.Value>
        <Box color="white">{value}</Box>
      </LabelValue.Value>
    </LabelValue>
  );
}
