import React from 'react';
import { shallow } from 'enzyme';
import { UIOptionsPanel } from '../UIOptionsPanel';

const uiOptions = [
  {
    key: 'hideTerminatedSubaccounts',
    label: 'Hide Subaccounts',
    description:
      'Hide terminated subacounts. Resources associated with terminated subaccounts can still be accessed.',
    value: false,
  },
];

const subject = (props = {}) =>
  shallow(<UIOptionsPanel uiOptions={uiOptions} setAccountOption={() => {}} {...props} />);

describe('UIOptionsPanel', () => {
  it('renders toggle correctly if option enabled', () => {
    const uiOption = uiOptions[0];
    const wrapper = subject({ uiOptions: [{ ...uiOption, value: true }] });
    expect(wrapper.find('Toggle')).toHaveProp('checked', true);
  });

  it('shoudld toggle', () => {
    const setAccountOption = jest.fn();
    const wrapper = subject({ setAccountOption });
    wrapper.find('Toggle').simulate('change');
    expect(setAccountOption).toHaveBeenCalledWith('hideTerminatedSubaccounts', true);
  });
});
