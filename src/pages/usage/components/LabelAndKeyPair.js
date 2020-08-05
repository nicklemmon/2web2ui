import React from 'react';
import { Definition } from 'src/components/text';
import { Box } from 'src/components/matchbox';

export const LabelAndKeyPair = ({ label, value }) => {
  return (
    <Definition dark>
      <Definition.Label>
        <Box fontSize="200">{label}</Box>
      </Definition.Label>
      <Definition.Value>
        <Box fontSize="400">{value}</Box>
      </Definition.Value>
    </Definition>
  );
};
