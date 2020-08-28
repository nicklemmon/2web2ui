import React from 'react';
import { shallow } from 'enzyme';
import PanelSectionLoading from '../PanelSectionLoading';

describe('PanelSectionLoading', () => {
  const subject = (props = {}) => shallow(<PanelSectionLoading {...props} />);

  it('renders a panel section loader', () => {
    const wrapper = subject();

    expect(wrapper.children()).toHaveProp('minHeight', '400px');
  });

  it('renders a panel section loader with a custom min height', () => {
    const wrapper = subject({ minHeight: '200px' });

    expect(wrapper.children()).toHaveProp('minHeight', '200px');
  });
});
