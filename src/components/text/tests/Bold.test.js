import React from 'react';
import { shallow } from 'enzyme';
import Bold from '../Bold';

describe('Bold', () => {
  it('renders bold text', () => {
    const wrapper = shallow(<Bold>Text</Bold>);
    expect(wrapper).toHaveTextContent('Text');
  });

  it('renders bold text with an id', () => {
    const wrapper = shallow(<Bold id="test-id">Text</Bold>);
    expect(wrapper).toHaveProp('id', 'test-id');
  });

  it('renders bold text with a passed in "data-id"', () => {
    const wrapper = shallow(<Bold data-id="my-data-id">Text</Bold>);
    expect(wrapper).toHaveProp('data-id', 'my-data-id');
  });
});
