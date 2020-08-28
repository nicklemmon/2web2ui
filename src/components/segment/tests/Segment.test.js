import React from 'react';
import { shallow, mount } from 'enzyme';
import { Segment } from '../Segment';
import getConfig from 'src/helpers/getConfig';
import { TRAITS } from 'src/helpers/segment';

jest.mock('src/helpers/getConfig');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: {
      pathname: '/',
    },
    listen: () => jest.fn(),
  }),
}));

describe('Segment', () => {
  const subject = props => shallow(<Segment {...props} />);
  const mountedSubject = props => mount(<Segment {...props} />);

  beforeEach(() => {
    window.analytics = {};
    window.analytics.identify = jest.fn();
    window.analytics.page = jest.fn();

    getConfig.mockReturnValueOnce(true);
  });

  it('does not add the script when segment config is enabled: false', () => {
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('adds the script when segment config is enabled: true', () => {
    getConfig.mockReturnValueOnce('abcdefg1234567');
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('calls segmentIdentify on load', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [TRAITS.EMAIL]: 'email@abc.com',
      [TRAITS.USER_ID]: 'username',
      [TRAITS.TENANT]: 'test-tenant',
    };
    mountedSubject(traits);
    expect(window.analytics.identify).toBeCalledTimes(1);
    expect(window.analytics.identify).toBeCalledWith('username//email@abc.com', traits);
  });

  it('does not call window.analytics.identify without user id/email', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [TRAITS.EMAIL]: 'email@abc.com',
      [TRAITS.TENANT]: 'test-tenant',
    };
    mountedSubject(traits);
    expect(window.analytics.identify).toBeCalledTimes(0);
  });

  it('calls segmentIdentify when a trait value changes', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [TRAITS.EMAIL]: 'email@abc.com',
      [TRAITS.USER_ID]: 'username',
      [TRAITS.TENANT]: 'test-tenant',
    };

    const subject = mountedSubject(traits);
    expect(window.analytics.identify).toBeCalledTimes(1);
    subject.setProps({ [TRAITS.EMAIL]: 'email2@abc.com' });
    expect(window.analytics.identify).toBeCalledTimes(1);
  });
});
