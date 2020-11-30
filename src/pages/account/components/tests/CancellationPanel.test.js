import React from 'react';
import { shallow } from 'enzyme';
import { CancellationPanel } from '../CancellationPanel';

describe('CancellationPanel', () => {
  const accountPendingCancellation = {
    pending_cancellation: { effective_date: '2019-07-20T00:00:00.000Z' },
  };
  const subject = props =>
    shallow(
      <CancellationPanel
        account={{ pending_cancellation: null }}
        renewAccount={() => {}}
        showAlert={() => {}}
        fetchAccount={() => {}}
        {...props}
      />,
    );

  it('renders', () => {
    expect(subject()).toMatchSnapshot();
  });

  it("renders a Confirmation Modal if guide doesn't load", () => {
    const wrapper = subject();
    wrapper.find('Button').simulate('click');
    expect(wrapper.find('ConfirmationModal').prop('open')).toBe(true);
  });

  it('renders renew button when pending cancellation ', () => {
    expect(
      subject({ account: accountPendingCancellation })
        .find('Button')
        .prop('children'),
    ).toEqual(expect.stringMatching(/Don't cancel my account/));
  });

  it('cancellation button is the destructive variant', () => {
    expect(
      subject()
        .find('Button')
        .prop('variant'),
    ).toBe('destructive');
  });

  it('refresh button renews account and retrieves new account state', async () => {
    const renewAccount = jest.fn(() => Promise.resolve());
    const showAlert = jest.fn();
    const fetchAccount = jest.fn();

    const wrapper = subject({
      account: accountPendingCancellation,
      renewAccount,
      showAlert,
      fetchAccount,
    });
    await wrapper.find('Button').simulate('click');
    expect(showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Your account will not be cancelled.',
    });
    expect(renewAccount).toHaveBeenCalled();
    expect(fetchAccount).toHaveBeenCalled();
  });
});
