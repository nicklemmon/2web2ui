import React from 'react';
import { render } from '@testing-library/react';
import { RejectionReasonsTable } from '../RejectionReasonsTable';
import TestApp from 'src/__testHelpers__/TestApp';

describe('Rejection Reasons Table', () => {
  const mockGetData = jest.fn();
  const defaultProps = {
    loading: false,
    reportOptions: {
      relativeRange: 'hour',
      from: 'randomDate',
      to: 'randomDate',
    },
    refreshRejectionReport: mockGetData,
    reasons: [
      {
        count_rejected: 65,
        rejection_category_name: 'Policy Rejection',
        rejection_category_id: 1,
        reason: '551 - Cannot Relay 105',
        domain: 'gmail.com',
      },
    ],
  };
  const subject = props =>
    render(
      <TestApp>
        <RejectionReasonsTable {...defaultProps} {...props} />
      </TestApp>,
    );
  it('renders with the correct row information', () => {
    const { queryByText } = subject();

    expect(mockGetData).toHaveBeenCalled();
    expect(queryByText('65')).toBeInTheDocument();
    expect(queryByText('Policy Rejection')).toBeInTheDocument();
    expect(queryByText('551 - Cannot Relay 105')).toBeInTheDocument();
    expect(queryByText('gmail.com')).toBeInTheDocument();
  });

  it('does not make api request when report options is not valid', () => {
    const {} = subject({
      reportOptions: {
        relativeRange: 'hour',
      },
    });
    expect(mockGetData).not.toHaveBeenCalled();
  });

  it('shows empty message when there is no data', () => {
    const { queryByText } = subject({ reasons: [] });

    expect(queryByText('No rejection reasons to report')).toBeInTheDocument();
  });
});
