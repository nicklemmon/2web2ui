import React from 'react';
import { shallow, mount } from 'enzyme';
import { Segment } from '../Segment';
import getConfig from 'src/helpers/getConfig';
import * as helpers from 'src/helpers/segment';

jest.mock('src/helpers/getConfig');
jest.mock('src/helpers/segment');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: {
      pathname: '/',
    },
    listen: jest.fn(),
  }),
}));

describe('Segment', () => {
  const subject = () => shallow(<Segment />);
  const mountedSubject = () => mount(<Segment />);
  helpers.segmentIdentify = jest.fn();
  helpers.segmentPage = jest.fn();

  it('does not add the script when segment config is enabled: false', () => {
    getConfig.mockReturnValue(false);
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('adds the script when segment config is enabled: true', () => {
    getConfig.mockReturnValueOnce(true).mockReturnValueOnce('abcdefg1234567');
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('calls segmentPage when route changes', () => {});

  it('calls segmentIdentify on load', () => {
    mountedSubject();
    expect(helpers.segmentIdentify).toBeCalledTimes(1);
  });

  it('calls segmentIdentify when a trait value changes', () => {});
});
