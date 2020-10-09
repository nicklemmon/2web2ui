import React from 'react';
import { shallow } from 'enzyme';
import { FeatureChangeProvider } from '../FeatureChangeContext';

const defaultProps = {
  plans: {
    '100K-premier-0519': {
      product: 'messaging',
      plan: 'plan-code',
    },
    'sso-0519': {
      product: 'sso',
      plan: 'sso-0519',
    },
    'subaccounts-0519': {
      product: 'subaccounts',
      plan: 'subaccounts-0519',
      limit: 15,
    },
    'subaccounts-starter': {
      product: 'subaccounts',
      plan: 'subaccounts-starter',
      limit: 0,
    },
    'reports-0519': {
      product: 'reports',
      plan: 'reports-0519',
      limit: 100,
    },
    'reports-starter': {
      product: 'reports',
      plan: 'reports-starter',
      limit: 10,
    },
    'tfa-required-0519': {
      product: 'tfa_required',
      plan: 'tfa-required-0519',
    },
    'ip-0519': {
      product: 'dedicated_ip',
      plan: 'ip-0519',
      volume: 1,
      limit: 4,
    },
  },
  subscription: {
    products: [
      {
        product: 'messaging',
        plan: '100K-premier-0519',
      },
      {
        product: 'subaccounts',
        plan: 'subaccounts-0519',
        quantity: 10,
        limit: 15,
      },
      {
        product: 'reports',
        plan: 'reports-0519',
        quantity: 100,
      },
      {
        product: 'sso',
        plan: 'sso-0519',
      },
      {
        product: 'tfa_required',
        plan: 'tfa-required-0519',
      },
      {
        product: 'dedicated_ip',
        plan: 'ip-0519',
      },
    ],
  },
  selectedBundle: {
    products: [
      { product: 'messaging', plan: '100K-premier-0519' },
      { product: 'sso', plan: 'sso-0519' },
      { product: 'tfa_required', plan: 'tfa-required-0519' },
      { product: 'subaccounts', plan: 'subaccounts-0519' },
      { product: 'reports', plan: 'reports-0519' },
      { product: 'dedicated_ip', plan: 'ip-0519' },
    ],
  },
  loading: false,
  getSubscription: jest.fn(),
};

const subject = (props = {}, children = 'child') =>
  shallow(
    <FeatureChangeProvider {...defaultProps} {...props}>
      {children}
    </FeatureChangeProvider>,
  );

describe('FeatureChangeContext', () => {
  it('should render correctly', () => {
    const wrapper = subject();
    expect(wrapper.prop('value')).toEqual(
      expect.objectContaining({
        features: [],
        loading: false,
      }),
    );
  });

  it('should pass loading state', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper.prop('value')).toEqual(
      expect.objectContaining({
        loading: true,
      }),
    );
  });

  it('should render acknowledgement for a change in auth', () => {
    const wrapper = subject({
      selectedBundle: {
        products: [
          { product: 'messaging', plan: '100K-premier-0519' },
          { product: 'subaccounts', plan: 'subaccounts-0519' },
          { product: 'reports', plan: 'reports-0519' },
          { product: 'dedicated_ip', plan: 'ip-0519' },
        ],
      },
    });
    expect(wrapper.prop('value')).toMatchSnapshot();
  });

  it('should render acknowledgement for a change in limit on subaccounts', () => {
    const wrapper = subject({
      selectedBundle: {
        products: [
          { product: 'messaging', plan: '100K-premier-0519' },
          { product: 'subaccounts', plan: 'subaccounts-starter' },
          { product: 'reports', plan: 'reports-0519' },
          { product: 'dedicated_ip', plan: 'ip-0519' },
          { product: 'sso', plan: 'sso-0519' },
          { product: 'tfa_required', plan: 'tfa-required-0519' },
        ],
      },
    });
    expect(wrapper.prop('value')).toMatchSnapshot();
  });

  it('should render acknowledgement for a change in limit on saved reports', () => {
    const wrapper = subject({
      selectedBundle: {
        products: [
          { product: 'messaging', plan: '100K-premier-0519' },
          { product: 'subaccounts', plan: 'subaccounts-0519' },
          { product: 'reports', plan: 'reports-starter' },
          { product: 'dedicated_ip', plan: 'ip-0519' },
          { product: 'sso', plan: 'sso-0519' },
          { product: 'tfa_required', plan: 'tfa-required-0519' },
        ],
      },
    });
    expect(wrapper.prop('value')).toMatchSnapshot();
  });

  it('should render acknowledgement for a change in dedicated IPs', () => {
    const wrapper = subject({
      selectedBundle: {
        products: [
          { product: 'messaging', plan: '100K-premier-0519' },
          { product: 'sso', plan: 'sso-0519' },
          { product: 'tfa_required', plan: 'tfa-required-0519' },
          { product: 'subaccounts', plan: 'subaccounts-0519' },
          { product: 'reports', plan: 'reports-0519' },
        ],
      },
    });
    expect(wrapper.prop('value')).toMatchSnapshot();
  });
});
