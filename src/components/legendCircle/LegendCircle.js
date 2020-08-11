import React from 'react';
import { Box } from 'src/components/matchbox';

const LegendCircle = ({ color, ...rest }) => {
  return (
    <Box //The color circle
      display="inline-block"
      height="16px"
      width="16px"
      border="1px solid" // todo, yuck
      borderColor="white"
      borderRadius="circle"
      backgroundColor={color}
      position="relative"
      {...rest}
    />
  );
};

export default LegendCircle;
