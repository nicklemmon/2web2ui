// GET /billing/bundles

export default () => ({
  results: [
    {
      bundle: 'free500-0419',
      status: 'public',
      tier: 'test',
      type: 'messaging',
      products: [
        {
          product: 'subaccounts',
          plan: 'subaccounts-free',
        },
        {
          product: 'sso',
          plan: 'sso',
        },
        {
          product: 'tfa_required',
          plan: 'tfa-required',
        },
        {
          product: 'online_support',
          plan: 'online-support-free',
        },
        {
          product: 'messaging',
          plan: 'free500-0419',
        },
      ],
    },

    {
      bundle: '100K-starter-0519',
      status: 'public',
      tier: 'starter',
      type: 'messaging',
      products: [
        {
          product: 'online_support',
          plan: 'online-support',
        },
        {
          product: 'subaccounts',
          plan: 'subaccounts-starter',
        },
        {
          product: 'messaging',
          plan: '100K-starter-0519',
        },
      ],
    },

    {
      bundle: '1M-premier-0519',
      status: 'public',
      tier: 'premier',
      type: 'messaging',
      products: [
        {
          product: 'dedicated_ip',
          plan: 'ip-0519',
        },
        {
          product: 'subaccounts',
          plan: 'subaccounts-premier',
        },
        {
          product: 'sso',
          plan: 'sso',
        },
        {
          product: 'tfa_required',
          plan: 'tfa-required',
        },
        {
          product: 'phone_support',
          plan: 'phone-support',
        },
        {
          product: 'online_support',
          plan: 'online-support',
        },
        {
          product: 'messaging',
          plan: '1M-premier-0519',
        },
      ],
    },
    {
      bundle: '2.5M-0817',
      status: 'secret',
      tier: 'unlimited',
      type: 'messaging',
      products: [
        {
          product: 'dedicated_ip',
          plan: 'ip-0519',
        },
        {
          product: 'sso',
          plan: 'sso',
        },
        {
          product: 'tfa_required',
          plan: 'tfa-required',
        },
        {
          product: 'phone_support',
          plan: 'phone-support',
        },
        {
          product: 'online_support',
          plan: 'online-support',
        },
        {
          product: 'subaccounts',
          plan: 'subaccounts-unlimited',
        },
        {
          product: 'messaging',
          plan: '2.5M-0817',
        },
      ],
    },
  ],
});
