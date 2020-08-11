import React from 'react';
import { shallow } from 'enzyme';
import ActionPopover from '../ActionPopover';

jest.mock('src/hooks/useUniqueId/useUniqueId');

describe('ActionPopover Component', () => {
  const subject = props => shallow(<ActionPopover id="test-popover" {...props} />);

  it('should render with no props', () => {
    const wrapper = subject();

    expect(wrapper.find('Popover')).toHaveProp('portalId', 'popover-portal');
    expect(wrapper.find('Popover')).toHaveProp('left', true);
    expect(wrapper.find('ActionList')).toExist();
  });

  it('should render with actions', () => {
    const actions = [
      { content: 'Edit', to: '/some/link' },
      { content: 'Delete', onClick: jest.fn() },
    ];
    const wrapper = subject({ actions });

    expect(wrapper.find('ActionList')).toHaveProp('actions', actions);
  });
});
