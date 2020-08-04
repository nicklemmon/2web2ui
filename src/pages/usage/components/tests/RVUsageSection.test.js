import React from 'react';
import { shallow } from 'enzyme';
import { RVUsageSection } from '../RVUsageSection';
import { formatDate } from 'src/helpers/date';

describe('RVUsageSection', () => {
  const defaultProps = {
    rvUsage: {
      recipient_validation: {
        day: {
          start: '2020-08-02T21:30:00.000Z',
          end: '2020-08-03T21:30:00.000Z',
          limit: -1,
          used: 73,
        },
        month: {
          start: '2020-07-05T08:00:00.000Z',
          end: '2020-08-05T08:00:00.000Z',
          used: 1832211,
        },
        timestamp: '2020-08-03T21:42:22.375Z',
      },
    },
  };

  const instance = shallow(<RVUsageSection {...defaultProps} />);

  it('renders with correct title', () => {
    expect(instance).toHaveTextContent('Recipient Validation Usage');
  });
  it('renders correct label and value pairs', () => {
    expect(instance).toHaveTextContent('Date Range');
    expect(instance).toHaveTextContent(
      `${formatDate(defaultProps.rvUsage.recipient_validation.month.start)} - ${formatDate(
        defaultProps.rvUsage.recipient_validation.month.end,
      )}`,
    );
    expect(instance).toHaveTextContent('Current Cycle Validations');
    expect(instance).toHaveTextContent(
      defaultProps.rvUsage.recipient_validation.month.used.toLocaleString(),
    );
    expect(instance).toHaveTextContent('Current Cycle Expenses');
  });
});
