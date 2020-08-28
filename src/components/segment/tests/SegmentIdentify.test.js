import React from 'react';
import { mount } from 'enzyme';
import { SegmentIdentify } from '../SegmentIdentify';
import getConfig from 'src/helpers/getConfig';
import { SEGMENT_TRAITS } from 'src/helpers/segment';

jest.mock('src/helpers/getConfig');

describe('SegmentIdentify', () => {
  const getSubject = props => mount(<SegmentIdentify {...props} />);

  beforeEach(() => {
    window.analytics = {};
    window.analytics.identify = jest.fn();
  });

  it('does not call window.analytics.identify without user id/email', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
      [SEGMENT_TRAITS.TENANT]: 'test-tenant',
    };
    getSubject(traits);
    expect(window.analytics.identify).toBeCalledTimes(0);
  });

  it('calls segmentIdentify when a trait value changes', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
      [SEGMENT_TRAITS.USER_ID]: 'username',
      [SEGMENT_TRAITS.TENANT]: 'test-tenant',
    };

    const subject = getSubject(traits);
    expect(window.analytics.identify).toBeCalledTimes(1);
    subject.setProps({ [SEGMENT_TRAITS.EMAIL]: 'email2@abc.com' });
    expect(window.analytics.identify).toBeCalledTimes(1);
  });
});
