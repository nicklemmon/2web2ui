import React from 'react';
import PropTypes from 'prop-types';
import { MoreHoriz } from '@sparkpost/matchbox-icons';
import { ActionList, Button, Popover, ScreenReaderOnly } from 'src/components/matchbox';
import useUniqueId from 'src/hooks/useUniqueId';

const ActionPopover = ({ actions }) => {
  const uniqueId = useUniqueId('action-popover');

  return (
    <div style={{ textAlign: 'right' }}>
      <Popover
        portalId="popover-portal"
        id={uniqueId}
        left
        trigger={
          <Button aria-controls={uniqueId} variant="minimal">
            <MoreHoriz />

            <ScreenReaderOnly>Open Menu</ScreenReaderOnly>
          </Button>
        }
      >
        <ActionList actions={actions} />
      </Popover>
    </div>
  );
};

ActionPopover.propTypes = {
  actions: PropTypes.array,
};

export default ActionPopover;
