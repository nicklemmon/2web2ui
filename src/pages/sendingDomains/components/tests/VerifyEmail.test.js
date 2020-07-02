import React from 'react';
import { shallow } from 'enzyme';

import { VerifyEmail } from '../VerifyEmail';

describe('VerifyEmail component', () => {
  const subject = props => {
    const baseProps = {
      id: 'xyz.com',
      verifyAbuse: () => Promise.resolve(),
      verifyMailbox: () => Promise.resolve(),
      verifyPostmaster: () => Promise.resolve(),
      showAlert: jest.fn(),
      verifyEmailLoading: false,
      subaccount: 'submarine',
      hasAnyoneAtEnabled: false,
    };
    return shallow(<VerifyEmail {...baseProps} {...props} />);
  };

  it('should render with postmaster and abuse email verification', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('updates localpart onchange', () => {
    const wrapper = subject({ hasAnyoneAtEnabled: true });
    wrapper.find('#localPart').simulate('change', { currentTarget: { value: 'new-value' } });
    expect(wrapper.state('localPart')).toEqual('new-value');
  });

  it('validates localpart onblur', () => {
    const wrapper = subject({ hasAnyoneAtEnabled: true });
    wrapper.find('#localPart').simulate('blur', { currentTarget: { value: '' } });
    expect(wrapper.state('error')).toEqual('Required');
  });

  it('should render with mailbox verification', () => {
    const wrapper = subject({ hasAnyoneAtEnabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should send abuse-at email', () => {
    const verifyAbuse = jest.fn().mockResolvedValue({});
    const wrapper = subject({ verifyAbuse });

    wrapper
      .find('VerifyButton')
      .at(1)
      .simulate('click');
    expect(verifyAbuse).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should send postmaster-at email', () => {
    const verifyPostmaster = jest.fn().mockResolvedValue({});
    const wrapper = subject({ verifyPostmaster });
    wrapper
      .find('VerifyButton')
      .at(0)
      .simulate('click');
    expect(verifyPostmaster).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });

  it('should send custom mailbox email', () => {
    const id = 'xyz.com';
    const subaccount = 'with-everything';
    const verifyMailbox = jest.fn().mockResolvedValue({});
    const wrapper = subject({ id, subaccount, hasAnyoneAtEnabled: true, verifyMailbox });
    wrapper.setState({ localPart: 'krombopulos.michael' });

    wrapper
      .find('VerifyButton')
      .at(0)
      .simulate('click');
    expect(verifyMailbox).toHaveBeenCalledTimes(1);
    expect(verifyMailbox).toHaveBeenCalledWith({
      id,
      mailbox: 'krombopulos.michael',
      subaccount,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should error if custom mailbox field is invalid', () => {
    const verifyMailbox = jest.fn().mockResolvedValue({});
    const wrapper = subject({ hasAnyoneAtEnabled: true, verifyMailbox });
    wrapper
      .find('VerifyButton')
      .at(0)
      .simulate('click');
    expect(verifyMailbox).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable the send button while sending', () => {
    const wrapper = subject({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render success message', async () => {
    const verifyPostmaster = jest.fn().mockResolvedValue({});
    const showAlert = jest.fn().mockResolvedValue({});
    const wrapper = subject({ verifyPostmaster, showAlert });
    await wrapper.instance().verifyWithPostmaster();

    expect(verifyPostmaster).toHaveBeenCalledTimes(1);
    expect(showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: `Email sent to postmaster@${wrapper.instance().props.id}`,
    });
    expect(wrapper).toMatchSnapshot();
  });
});
