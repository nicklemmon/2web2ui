import React from 'react';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import { SingleResult } from '../SingleResult';

describe('SingleResult', () => {
  const subject = props => {
    const defaultProps = {
      singleResults: {
        result: 'valid',
        valid: true,
        reason: 'Invalid Domain',
        is_role: false,
        is_disposable: false,
        delivery_confidence: 45,
        is_free: false,
        did_you_mean: 'harry.potter@hogwarts.edu',
        email: 'harry.potter@hogwarts.com',
      },
      singleAddress: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn(),
      },
    };
    const mergedProps = Object.assign(defaultProps, props);

    return render(
      <TestApp>
        <SingleResult {...mergedProps} />
      </TestApp>,
    );
  };

  it('should render without crashing when certain props are missing', () => {
    const { queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: false,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
      },
    });

    expect(queryByText('Recipient Validation')).toBeInTheDocument();
  });

  it('should redirect and show an alert when the "singleAddress" function fails', () => {
    const promise = Promise.reject({ message: 'Mock error message' });
    const mockShowAlert = jest.fn();
    const mockPush = jest.fn();
    const mockHistory = { push: mockPush };
    subject({
      showAlert: mockShowAlert,
      history: mockHistory,
      singleAddress: jest.fn(() => promise),
    });

    return promise.catch(() => {
      expect(mockShowAlert).toHaveBeenCalledWith({
        message: 'Mock error message',
        type: 'error',
      });
      expect(mockPush).toHaveBeenCalledWith('/recipient-validation/single');
    });
  });

  it('renders a loading controlled via the "loading" prop', () => {
    const { queryByTestId, queryByText } = subject({ singleResults: {}, loading: true });

    expect(queryByTestId('loading')).toBeInTheDocument();
    expect(queryByText('Recipient Validation')).not.toBeInTheDocument();
  });

  it('renders the email address typo information when the "did_you_mean" field is returned', () => {
    const { queryAllByText } = subject({
      singleResults: {
        valid: true,
        is_role: false,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        did_you_mean: 'hello@world.com',
      },
    });

    expect(queryAllByText('hello@world.com')).toHaveLength(2);
  });

  it('renders the valid state when the result is "valid"', () => {
    const { queryByTestId, queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        result: 'valid',
      },
    });

    expect(queryByTestId('validation-result-status')).toHaveTextContent(/valid$/i);
    expect(
      queryByText(
        'Our data indicates we have seen deliveries and/or active engagement associated with this email address. We have no data suggesting that this is an invalid email address for any reason.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the neutral state when the result is "neutral"', () => {
    const { queryByTestId, queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        result: 'neutral',
      },
    });

    expect(queryByTestId('validation-result-status')).toHaveTextContent(/neutral$/i);
    expect(
      queryByText(
        'Our data indicates we have not seen any bounces associated with this email address that would suggest it to be invalid or undeliverable to. However, we have not seen any specific delivery and/or engagement events associated as well.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the risky state when the result is "risky"', () => {
    const { queryByTestId, queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        result: 'risky',
      },
    });

    expect(queryByTestId('validation-result-status')).toHaveTextContent(/risky$/i);
    expect(
      queryByText(
        'A risky result means that our data analysis indicated that the email address has bounced at least once in the past, but has not seen a subsequent bounce in quite some time. Data suggests this email address can in fact be delivered to, however there is some potential risk of the email address bouncing.',
      ),
    ).toBeInTheDocument();
  });

  it('renders the undeliverable state when the result is "undeliverable"', () => {
    const { queryByTestId, queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        result: 'undeliverable',
      },
    });

    expect(queryByTestId('validation-result-status')).toHaveTextContent(/undeliverable$/i);
    expect(
      queryByText('Our data strongly indicates this email address cannot be delivered to.'),
    ).toBeInTheDocument();
  });

  it('renders the typo state when the result is "typo"', () => {
    const { queryByTestId, queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        result: 'typo',
      },
    });

    expect(queryByTestId('validation-result-status')).toHaveTextContent(/typo$/i);
    expect(
      queryByText(
        'Our data indicates there is likely a typo in the domain for this email address. Check “did you mean” for our best recommendation to fix the misspelled domain.',
      ),
    ).toBeInTheDocument();
  });

  it('does renders without crashing when the "result" field does not match a valid description', () => {
    const { queryByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: false,
        is_free: true,
        delivery_confidence: 45,
        result: 'not-a-real-result',
      },
    });

    expect(queryByText('Recipient Validation')).toBeInTheDocument();
  });

  it('renders the provided "Undeliverable" when no "result" is present', () => {
    const { queryByText } = subject({
      singleResults: {
        valid: false,
        is_role: true,
        is_disposable: true,
        is_free: false,
        delivery_confidence: 45,
        reason: 'Mock Reason',
      },
    });

    expect(queryByText('Mock Reason')).toBeInTheDocument();
    expect(queryByText('undeliverable')).toBeInTheDocument();
  });

  it('renders without crashing when no "result" or "reason" are returned', () => {
    const { queryByText } = subject({
      singleResults: {
        valid: false,
        is_role: true,
        is_disposable: true,
        is_free: false,
        delivery_confidence: 45,
      },
    });

    expect(queryByText('Recipient Validation')).toBeInTheDocument();
  });

  it('renders the delivery confidence score', () => {
    const { getAllByText } = subject({
      singleResults: {
        valid: true,
        is_role: true,
        is_disposable: true,
        is_free: true,
        delivery_confidence: 99,
      },
    });

    expect(getAllByText('99')).toHaveLength(2);
  });

  it('renders the relevant API response value in the "Raw API Response" portion of the view', () => {
    const { queryByTestId } = subject({
      singleResults: {
        valid: false,
        is_role: false,
        is_disposable: false,
        is_free: false,
        delivery_confidence: 45,
        reason: 'fake reason',
        did_you_mean: 'fake-email@gmail.com',
      },
    });

    expect(queryByTestId('valid-value')).toHaveTextContent('false', { normalizeWhitespace: true });
    expect(queryByTestId('delivery_confidence-value')).toHaveTextContent('45', {
      normalizeWhitespace: true,
    });
    expect(queryByTestId('is_role-value')).toHaveTextContent('false', {
      normalizeWhitespace: true,
    });
    expect(queryByTestId('is_disposable-value')).toHaveTextContent('false', {
      normalizeWhitespace: true,
    });
    expect(queryByTestId('is_free-value')).toHaveTextContent('false', {
      normalizeWhitespace: true,
    });
    expect(queryByTestId('reason-value')).toHaveTextContent('fake reason', {
      normalizeWhitespace: true,
    });
    expect(queryByTestId('did_you_mean-value')).toHaveTextContent('fake-email@gmail.com', {
      normalizeWhitespace: true,
    });
  });
});
