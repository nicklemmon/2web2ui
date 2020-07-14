// GET /account

export default () => ({
  bill_cycle_day: 5,
  pending_downgrades: [],
  products: [
    {
      plan: 'online-support',
      product: 'online_support',
      price: 0,
    },
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
      quantity: 1,
      limit: 100000,
      price: 0,
    },
    {
      plan: 'sso',
      product: 'sso',
      price: 0,
    },
    {
      plan: 'tfa-required',
      product: 'tfa_required',
      price: 0,
    },
    {
      plan: 'phone-support',
      product: 'phone_support',
      price: 0,
    },
    {
      billing_id: 'id1',
      plan: '5M-0817',
      product: 'messaging',
      price: 123,
      overage: 0.3,
      volume: 100000,
      billing_period: 'month',
    },
    {
      plan: 'rv-0519',
      product: 'recipient_validation',
      daily_limit: -1,
      price: 0,
      billing_period: 'month',
    },
  ],
  type: 'active',
});
