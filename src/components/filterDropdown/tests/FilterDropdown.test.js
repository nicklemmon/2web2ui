import { shallow } from 'enzyme';
import React from 'react';
import { FilterDropdown } from '../FilterDropdown';

describe('Component: FilterDropdown', () => {
  const props = {
    formName: 'myForm',
    label: 'My Label',
    id: 'my-filter-dropdown',
    namespace: 'status',
    displayValue: 'Status',
    change: jest.fn(),
    options: [
      { content: 'Active', name: 'active' },
      { content: 'Terminated', name: 'terminated' },
      { content: 'Suspended', name: 'suspended' },
    ],
  };

  const e = {
    stopPropagation: jest.fn(),
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<FilterDropdown {...props} />);
  });

  it('renders selected correctly', () => {
    wrapper.setProps({ values: { suspended: true } });
    expect(
      wrapper
        .find('ActionList')
        .props('actions')
        .actions.find(action => action.name === 'suspended'),
    ).toHaveProperty('selected', true);
  });

  it('handles click', () => {
    wrapper.setProps({ values: { suspended: true } });
    const changeSpy = jest.spyOn(wrapper.instance().props, 'change');
    const eSpy = jest.spyOn(e, 'stopPropagation');
    wrapper.instance().handleActionClick(e, 'terminated');
    expect(changeSpy).toHaveBeenCalledWith(props.formName, `${props.namespace}.terminated`, true);
    expect(eSpy).toHaveBeenCalled();
  });
});
