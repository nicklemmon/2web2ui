import React from 'react';
import { shallow } from 'enzyme';
import { UsagePage } from '../UsagePage';

describe('UsagePage', () => {
  const defaultProps = {
    getAccount: jest.fn(),
    getSubscription: jest.fn(),
    getUsage: jest.fn(),
    usage: {},
    rvUsage: {},
    subscription: {},
    billingSubscription: {},
  };

  const instance = shallow(<UsagePage {...defaultProps} />);

  it('renders correctly', () => {
    expect(instance.find('MessagingUsageSection')).toHaveLength(1);
    expect(instance.find('FeatureUsageSection')).toHaveLength(1);
    expect(instance.find('RVUsageSection')).toHaveLength(1);
  });
});
