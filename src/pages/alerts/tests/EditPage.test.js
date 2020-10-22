import { shallow } from 'enzyme';
import React from 'react';
import { EditPage } from '../EditPage';
import formatFormValues from '../helpers/formatFormValues';
import AlertForm from '../components/AlertForm';

jest.mock('../helpers/formatFormValues');

describe('Page: Alerts Edit', () => {
  const props = {
    updateAlert: jest.fn(() => Promise.resolve({})),
    showUIAlert: jest.fn(),
    error: null,
    history: {
      push: jest.fn()
    },
    loading: false,
    getAlert: jest.fn(),
    getError: undefined,
    getLoading: undefined,
    id: 'alert-id-1',
    alert: {}
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<EditPage {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render Loading when loading alert', () => {
    wrapper.setProps({ getLoading: true });
    expect(wrapper.find('Loading')).toExist();
  });

  it('should render Error when there is an error when getting alert', () => {
    wrapper.setProps({ getError: true });
    expect(wrapper.find('RedirectAndAlert')).toExist();
  });

  it('should get alert when component mounts', () => {
    wrapper = shallow(<EditPage {...props} id={'alert-id-2'} />);
    expect(props.getAlert).toHaveBeenCalledWith({ id: 'alert-id-2' });
  });

  it('should handle submit', async () => {
    formatFormValues.mockImplementationOnce((a) => a);
    await wrapper.find(AlertForm).simulate('submit', { value: 'mock value' });
    expect(props.updateAlert).toHaveBeenCalledWith({ data: { value: 'mock value' }, id: props.id });
    expect(props.showUIAlert).toHaveBeenCalled();
    expect(props.history.push).toHaveBeenCalledWith('/alerts/details/alert-id-1');
  });
});
