import React from 'react';
import { shallow } from 'enzyme';

import { ImmediateCancelAccountPage } from '../ImmediateCancelAccountPage';
import * as segmentHelpers from 'src/helpers/segment';
jest.mock('src/helpers/conversionTracking');
segmentHelpers.segmentTrack = jest.fn();
describe('Component: ImmediateCancelAccountPage', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      history: { replace: jest.fn() },
      fetchAccount: jest.fn(() => Promise.resolve()),
      cancelAccount: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
    };
    wrapper = shallow(<ImmediateCancelAccountPage {...props} />);
  });

  it('should handle account cancellation immediately', async () => {
    await wrapper;
    expect(props.cancelAccount).toHaveBeenCalled();
    expect(segmentHelpers.segmentTrack).toHaveBeenCalledWith(
      segmentHelpers.SEGMENT_EVENTS.ACCOUNT_CANCELLED,
    );
    expect(props.fetchAccount).toHaveBeenCalled();
    expect(props.history.replace).toHaveBeenCalledWith('/account/settings');
    expect(props.showAlert).toHaveBeenCalledWith({
      message: 'Your plan is set to be cancelled.',
      type: 'success',
    });
  });

  it('should render error page if cannot cancel', async () => {
    props.cancelAccount = jest.fn(() => Promise.reject({ message: 'Error message' }));
    wrapper = shallow(<ImmediateCancelAccountPage {...props} />);
    await wrapper;

    expect(props.cancelAccount).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });
});
