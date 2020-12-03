import React from 'react';
import { Box, Stack } from '@sparkpost/matchbox-hibana';
import { format } from 'date-fns';
import { getFriendlyFilterLabel } from './Filters';

function Tooltip(props) {
  const { data } = props;
  // const friendlyLabel = getFriendlyFilterLabel(data);

  return (
    <Box bg="gray.900" p="200" color="white" borderRadius="200" boxShadow="200" width="200px">
      <Stack space="100">
        <Box fontSize="200">{format(data.date, 'MMM DD YYYY')}</Box>
        <Box borderLeft="3px solid #cce3ff" pl="300">
          <Box fontSize="200" color="gray.400">
            Daily
          </Box>
          <Box fontSize="300">{data.day.toLocaleString()}</Box>
        </Box>
        <Box borderLeft="3px solid #abd2ff" pl="300">
          <Box fontSize="200" color="gray.400">
            Weekly
          </Box>
          <Box fontSize="300">{data.week.toLocaleString()}</Box>
        </Box>
        <Box borderLeft="3px solid #78b6ff" pl="300">
          <Box fontSize="200" color="gray.400">
            Monthly
          </Box>
          <Box fontSize="300">{data.month.toLocaleString()}</Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Tooltip;
