import React from 'react';
import PropTypes from 'prop-types';
import { Popover,  ActionList } from '@sparkpost/matchbox';
import { Button } from 'src/components/matchbox';
import { MoreHoriz } from '@sparkpost/matchbox-icons';

const ActionPopover = ({ actions }) => (
  <div style={{ textAlign: 'right' }}>
    <Popover left trigger={<Button flat><MoreHoriz size={20}/></Button>}>
      <ActionList actions={actions}/>
    </Popover>
  </div>
);

ActionPopover.propTypes = {
  actions: PropTypes.array
};

export default ActionPopover;
