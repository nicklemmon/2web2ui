import { shallow } from 'enzyme';
import React from 'react';

import { EditPage } from '../EditPage';

import { domain as domainRecord } from './helpers/domain';
import { GUIDE_IDS } from 'src/constants';

describe('Sending Domains Edit Page', () => {
  let wrapper;
  let props;

  const domain = Object.assign({}, domainRecord);
  const mockshow = jest.fn();

  beforeEach(() => {
    props = {
      domain,
      clearSendingDomain: jest.fn(),
      error: null,
      loading: false,
      getDomain: jest.fn(),
      deleteDomain: jest.fn(() => Promise.resolve()),
      updateDomain: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn(),
      },
      location: { state: { triggerGuide: true } },
      showAlert: jest.fn(),
      match: {
        params: { id: 'example.com' },
      },
      hasAutoVerifyEnabled: false,
    };
    window.Appcues = {};
    window.Appcues = { show: mockshow };

    wrapper = shallow(<EditPage {...props} />);
  });

  it('should renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getDomain).toHaveBeenCalledTimes(1);
  });

  it('should renders loading correctly', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirects to list page with error message', () => {
    wrapper.setProps({ error: new Error('Oh no!') });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show a delete modal', () => {
    wrapper.instance().toggleDelete();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should delete a sending domain', async () => {
    await wrapper.instance().deleteDomain();
    expect(props.deleteDomain).toHaveBeenCalledWith({
      id: domain.id,
      subaccount: domain.subaccount_id,
    });
  });

  it('should redirect after delete', async () => {
    await wrapper.instance().deleteDomain();
    expect(props.history.push).toHaveBeenCalledWith('/account/sending-domains');
  });

  it('should toggle subaccount sharing', async () => {
    await wrapper.instance().shareDomainChange();
    expect(props.updateDomain).toHaveBeenCalledWith({
      id: domain.id,
      shared_with_subaccounts: true,
      subaccount: domain.subaccount_id,
    });
  });

  it('should clear sending domain on unmount', () => {
    wrapper.unmount();
    expect(props.clearSendingDomain).toHaveBeenCalledTimes(1);
  });

  it('should trigger guide when location state has triggerGuide set to true', () => {
    const location = { state: { triggerGuide: true } };
    expect(mockshow).not.toHaveBeenCalled();
    wrapper.setProps({ location: location });
    expect(mockshow).toHaveBeenCalledWith(GUIDE_IDS.VERIFY_SENDING_DOMAIN);
  });
});
