import React from 'react';
import { DateTimeSection } from '../DateTimeSection';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';

describe('DateTimeSection', () => {
  const defaultProps = {
    reportOptions: {},
    refreshReportOptions: jest.fn(),
  };
  const subject = props => {
    return render(
      <TestApp>
        <DateTimeSection {...defaultProps} {...props} />
      </TestApp>,
    );
  };

  it('should disable fields when not using metrics rollup', () => {
    const { getByLabelText } = subject({ useMetricsRollup: false });
    expect(getByLabelText('Precision')).toHaveAttribute('disabled');
    expect(getByLabelText('Time Zone')).toHaveAttribute('disabled');
  });

  it('should not disable fields when using metrics rollup', () => {
    const { getByLabelText } = subject({ useMetricsRollup: true });
    expect(getByLabelText('Precision')).not.toHaveAttribute('disabled');
    expect(getByLabelText('Time Zone')).not.toHaveAttribute('disabled');
  });
});
