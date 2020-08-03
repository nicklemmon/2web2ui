import React from 'react';
import { Definition } from 'src/components/text';
import { Box } from 'src/components/matchbox';
import { tokens } from '@sparkpost/design-tokens-hibana';

export const LabelAndKeyPair = ({ label, value }) => {
  return (
    <Definition>
      <Definition.Label>
        <Box color={tokens.color_gray_600} fontSize="200">
          {label}
        </Box>
      </Definition.Label>
      <Definition.Value>
        <Box color={tokens.color_white} fontSize="400">
          {value}
        </Box>
      </Definition.Value>
    </Definition>
  );
};
