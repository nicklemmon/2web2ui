import { shallow } from 'enzyme';
import React from 'react';
import { CreatePage } from '../CreatePage';
import formatFormValues from '../helpers/formatFormValues';
import AlertForm from '../components/AlertForm';
import * as segmentHelpers from 'src/helpers/segment';

jest.mock('../helpers/formatFormValues');
segmentHelpers.segmentTrack = jest.fn();

describe('Page: Alerts Create', () => {
  const props = {
    createAlert: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
    showUIAlert: jest.fn(),
    error: null,
    history: {
      push: jest.fn(),
    },
    loading: false,
    getAlert: jest.fn(),
    getError: undefined,
    getLoading: undefined,
    idToDuplicate: undefined,
    alert: {},
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CreatePage {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Loading when loading duplicate alert', () => {
    wrapper.setProps({ getLoading: true });
    expect(wrapper.find('Loading')).toExist();
  });

  it('should render Error when there is an error during duplicate alert', () => {
    wrapper.setProps({ getError: true });
    expect(wrapper.find('RedirectAndAlert')).toExist();
  });

  it('should get alert if duplicate id exists', () => {
    const newProps = { idToDuplicate: 'alert-id-1' };
    wrapper = shallow(<CreatePage {...props} {...newProps} />);
    expect(props.getAlert).toHaveBeenCalledWith({ id: 'alert-id-1' });
  });

  it('breadcrumb should link to details page if its a duplicate alert', () => {
    wrapper.setProps({ idToDuplicate: 'alert-id-1' });
    expect(wrapper.find('Page').prop('breadcrumbAction').to).toEqual('/alerts/details/alert-id-1');
  });

  it('should handle submit', async () => {
    formatFormValues.mockImplementationOnce(a => a);
    await wrapper.find(AlertForm).simulate('submit', { value: 'mock value' });
    expect(segmentHelpers.segmentTrack).toHaveBeenCalledWith(
      segmentHelpers.SEGMENT_EVENTS.ALERT_CREATED,
    );
    expect(props.createAlert).toHaveBeenCalledWith({ data: { value: 'mock value' } });
    expect(props.showUIAlert).toHaveBeenCalled();
    expect(props.history.push).toHaveBeenCalledWith('/alerts/details/mock-id');
  });
});
