import React from 'react';
import { Box, Text } from 'src/components/matchbox';
import { DomainStatusTag } from 'src/components/tags';
import { VerifiedIcon } from './Icons';

const StatusLabel = ({ status }) => {
  if (status === 'verified') {
    return (
      <Box display="flex" alignItems="center">
        <Text as="span" fontSize="300" fontWeight="400" color="gray.900">
          Verified
        </Text>

        <VerifiedIcon />
      </Box>
    );
  }

  return <DomainStatusTag status={status} />;
};

export default StatusLabel;
