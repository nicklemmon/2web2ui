import React from 'react';
import { shallow } from 'enzyme';
import { FeatureUsageSection } from '../FeatureUsageSection';
describe('FeatureUsageSection', () => {
  const defaultProps = {
    billingSubscription: {
      bill_cycle_day: 5,
      pending_downgrades: [],
      products: [
        {
          plan: 'ip-0519',
          product: 'dedicated_ip',
          limit: 4,
          price: 20,
          volume: 1,
          billing_period: 'month',
        },
        {
          plan: 'subaccounts-premier',
          product: 'subaccounts',
          quantity: 2,
          limit: 6789,
          limit_override: 6789,
          price: 0,
        },
      ],
      type: 'active',
    },
  };
  const instance = (props = {}) => shallow(<FeatureUsageSection {...props} />);
  it('renders the correct title for section', () => {
    expect(instance(defaultProps)).toHaveTextContent('Feature Usage');
  });
  it('renders a product section only when it is present in subscription', () => {
    expect(instance(defaultProps)).toHaveTextContent('Dedicated IPs');
    expect(instance(defaultProps)).toHaveTextContent('Subaccounts');
    expect(
      instance({
        billingSubscription: {
          bill_cycle_day: 5,
          pending_downgrades: [],
          products: [
            {
              plan: 'subaccounts-premier',
              product: 'subaccounts',
              quantity: 2,
              limit: 6789,
              limit_override: 6789,
              price: 0,
            },
          ],
          type: 'active',
        },
      }),
    ).not.toHaveTextContent('Dedicated IPs');
  });
});
