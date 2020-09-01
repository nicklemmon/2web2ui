import React from 'react';
import { shallow } from 'enzyme';
import { Segment } from '../Segment';
import getConfig from 'src/helpers/getConfig';

jest.mock('src/helpers/getConfig');

describe('Segment', () => {
  const getSubject = props => shallow(<Segment {...props} />);

  beforeEach(() => {
    window.analytics = {};
    window.analytics.identify = jest.fn();
    window.analytics.page = jest.fn();

    getConfig.mockReturnValueOnce(true);
  });

  it('does not add the script when segment config is enabled: false', () => {
    const wrapper = getSubject();

    expect(wrapper).toMatchSnapshot();
  });

  it('adds the script when segment config is enabled: true', () => {
    getConfig.mockReturnValueOnce('abcdefg1234567');
    const wrapper = getSubject();

    expect(wrapper).toMatchSnapshot();
  });
});
