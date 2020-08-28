import React from 'react';
import { mount } from 'enzyme';
import SegmentPage from '../SegmentPage';
import getConfig from 'src/helpers/getConfig';
import { SEGMENT_TRAITS } from 'src/helpers/segment';

jest.mock('src/helpers/getConfig');

const unlisten = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    location: {
      pathname: '/',
    },
    listen: () => unlisten,
  }),
}));

describe('Segment', () => {
  const getSubject = props => mount(<SegmentPage {...props} />);

  beforeEach(() => {
    window.analytics = {};
    window.analytics.page = jest.fn();
  });

  it('calls segmentIdentify on load', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
      [SEGMENT_TRAITS.USER_ID]: 'username',
      [SEGMENT_TRAITS.TENANT]: 'test-tenant',
    };
    getSubject(traits);
    expect(window.analytics.identify).toBeCalledTimes(1);
    expect(window.analytics.identify).toBeCalledWith('username//email@abc.com', traits);
  });
});
