import React from 'react';
import { mount } from 'enzyme';
import { SegmentIdentify } from '../SegmentIdentify';
import getConfig from 'src/helpers/getConfig';
import * as helpers from 'src/helpers/segment';

jest.mock('src/helpers/getConfig');
jest.mock('src/helpers/segment');

describe('SegmentIdentify', () => {
  const getSubject = props => mount(<SegmentIdentify accessControlReady {...props} />);

  beforeEach(() => {
    helpers.segmentIdentify = jest.fn();
  });

  it('calls segmentIdentify when a trait value changes', () => {
    getConfig.mockReturnValue('test-tenant');
    const traits = {
      [helpers.SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
      [helpers.SEGMENT_TRAITS.USER_ID]: 'username',
      [helpers.SEGMENT_TRAITS.TENANT]: 'test-tenant',
    };

    const subject = getSubject(traits);

    expect(helpers.segmentIdentify).toBeCalledTimes(1);
    subject.setProps({ [helpers.SEGMENT_TRAITS.TENANT]: 'new-tenant' });
    expect(helpers.segmentIdentify).toBeCalledTimes(2);
    subject.setProps({ [helpers.SEGMENT_TRAITS.TENANT]: 'newer-tenant' });
    expect(helpers.segmentIdentify).toBeCalledTimes(3);
  });

  it('does not call segmentIdentify if access control is not ready', () => {
    getConfig.mockReturnValue('test-tenant');
    const props = {
      accessControlReady: false,
      [helpers.SEGMENT_TRAITS.EMAIL]: 'email@abc.com',
      [helpers.SEGMENT_TRAITS.USER_ID]: 'username',
      [helpers.SEGMENT_TRAITS.TENANT]: 'test-tenant',
    };

    const subject = getSubject(props);

    subject.setProps({ [helpers.SEGMENT_TRAITS.EMAIL]: 'email2@abc.com' });
    expect(helpers.segmentIdentify).toBeCalledTimes(0);
  });
});
