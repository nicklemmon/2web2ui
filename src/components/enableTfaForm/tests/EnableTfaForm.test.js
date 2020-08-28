import React from 'react';
import { shallow } from 'enzyme';
import { EnableTfaForm, RenderedForm } from '../EnableTfaForm';

describe('Component: EnableTfaForm', () => {
  const baseProps = {
    enabled: true,
    toggleError: false,
    togglePending: false,
    secret: 'super-secret',
    username: 'kevin-mitnick',
  };

  const mockOnClose = jest.fn();
  const mockAfterEnable = jest.fn();
  const mockToggleTfa = jest.fn().mockResolvedValue();
  const mockShowAlert = jest.fn();
  const actions = {
    getTfaSecret: jest.fn(),
    toggleTfa: mockToggleTfa,
    showAlert: mockShowAlert,
    afterEnable: mockAfterEnable,
    onClose: mockOnClose,
  };

  const mockHandleInputChange = jest.fn();
  const mockOnEnable = jest.fn();
  const formProps = {
    ...baseProps,
    ...actions,
    handleInputChange: mockHandleInputChange,
    onEnable: mockOnEnable,
  };

  function pageSubject(props) {
    return shallow(<EnableTfaForm {...baseProps} {...actions} {...props} />);
  }
  function formSubject(props) {
    return shallow(<RenderedForm {...formProps} {...props} />);
  }

  it('should request tfa secret on mount', () => {
    expect(pageSubject().instance().props.getTfaSecret).toHaveBeenCalledTimes(1);
  });

  it('should show loading while retrieving 2fa deets', () => {
    expect(formSubject({ secret: null }).find('Loading')).toExist();
  });

  it('should show form after loading', () => {
    const wrapper = pageSubject({ secret: 'sauce' }).dive();

    expect(wrapper).toHaveTextContent('Step 1: Configure your 2FA app');
    expect(wrapper).toHaveTextContent('Step 2: Enter a 2FA code');
  });

  it('should call afterEnable after toggling', () => {
    const wrapper = pageSubject({ togglePending: true });
    wrapper.setProps({ togglePending: false });
    wrapper.update();
    expect(mockAfterEnable).toHaveBeenCalledTimes(1);
  });

  it('should show alert after toggling', () => {
    const wrapper = pageSubject({ togglePending: true });
    wrapper.setProps({ togglePending: false });
    wrapper.update();
    expect(mockShowAlert).toHaveBeenCalledTimes(1);
  });

  it('should handle changes to passcode', () => {
    const wrapper = formSubject();
    wrapper.find('TextField').simulate('change', { target: { value: 'pcode' } });
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('should call toggleTfa(onEnable) on button click', () => {
    const wrapper = formSubject({ code: 'pcode' });
    wrapper
      .find('Button[type="submit"]')
      .first()
      .simulate('click');
    expect(mockOnEnable).toHaveBeenCalled();
  });

  it('should show verifying as button text when togglePending', () => {
    expect(
      formSubject({ togglePending: true })
        .find('Button[type="submit"]')
        .children()
        .text(),
    ).toContain('Verifying');
  });

  it('should show error on TextField when toggleError', () => {
    const wrapper = formSubject({ toggleError: true });
    expect(wrapper.find('TextField').prop('error').length).toBeGreaterThan(0);
  });

  it('should not show cancel button if onClose prop not set', () => {
    expect(formSubject({ onClose: null }).find('Button')).toHaveLength(1);
  });

  it('should show cancel button if onClose prop set', () => {
    expect(formSubject().find('Button')).toHaveLength(2);
  });

  it('should close on cancel', () => {
    const wrapper = formSubject();
    wrapper
      .find('Button')
      .at(1)
      .simulate('click');
    expect(mockOnClose).toHaveBeenCalled();
  });
});
