import React from 'react';
import { Box, Stack } from '@sparkpost/matchbox-hibana';
import { format } from 'date-fns';
import { getFriendlyFilterLabel } from './Filters';

function Tooltip(props) {
  const { data } = props;
  const friendlyLabel = getFriendlyFilterLabel(data);

  return (
    <Box bg="gray.900" p="200" color="white" borderRadius="200" boxShadow="200" width="200px">
      <Stack space="100">
        <Box fontSize="200">{format(data.date, 'MMM DD YYYY')}</Box>
        <Box borderLeft="3px solid rgba(235, 240, 245, 1)" pl="300">
          <Box fontSize="200" color="gray.400">
            Delivered
          </Box>
          <Box fontSize="300">{Number(data.delivery).toLocaleString()}</Box>
        </Box>
        <Box borderLeft="3px solid #78b6ff" pl="300">
          <Box fontSize="200" color="gray.400">
            {friendlyLabel}
          </Box>
          <Box fontSize="300">
            {((data.value / data.delivery) * 100).toFixed(1)}% – {Number(data.value).toLocaleString()}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Tooltip;
