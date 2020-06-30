import React from 'react';
import { Tag } from 'src/components/matchbox';
import { snakeToFriendly } from 'src/helpers/string';

const StatusTag = ({ status }) => {
  if (!status) {
    return null;
  }

  let tagColor = null;

  if (status === 'completed') {
    tagColor = 'green';
  }

  if (status === 'running') {
    tagColor = 'yellow';
  }

  return <Tag color={tagColor}>{snakeToFriendly(status)}</Tag>;
};

export default StatusTag;
