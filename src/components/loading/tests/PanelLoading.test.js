import React from 'react';
import PanelLoading from '../PanelLoading';
import { shallow } from 'enzyme';

describe('Panel Loading', () => {
  const subject = props => shallow(<PanelLoading {...props} />);

  it('renders with passed in minHeight', () => {
    const wrapper = subject({ minHeight: '1000px' });

    expect(wrapper.find('Loading')).toHaveProp('minHeight', '1000px');
  });

  it('renders with the passed in accent', () => {
    const wrapper = subject({ accent: true });

    expect(wrapper).toHaveProp('accent', true);
  });

  it('renders with the passed in title', () => {
    const wrapper = subject({ title: 'Hello, world.' });

    expect(wrapper).toHaveProp('title', 'Hello, world.');
  });
});
