// GET /billing/plans

export default () => ({
  results: [
    {
      billing_id: '1',
      plan: '2.5M-0817',
      product: 'messaging',
      price: 899,
      overage: 0.4,
      volume: 2500000,
    },

    {
      plan: 'free5020-0419',
      product: 'messaging',
      price: 0,
      volume: 500,
    },

    {
      billing_id: '2',
      plan: '100K-starter-0519',
      product: 'messaging',
      price: 30,
      overage: 0.85,
      volume: 100000,
    },

    {
      billing_id: '3',
      plan: '1M-premier-0519',
      product: 'messaging',
      price: 525,
      overage: 0.55,
      volume: 1000000,
    },
  ],
});
