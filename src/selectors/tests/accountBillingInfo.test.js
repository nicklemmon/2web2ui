import * as billingInfo from '../accountBillingInfo';

const initialState = {
  account: { subscription: { code: '5M-0817' }, billing: {} },

  billing: {
    subscription: {
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
    },
    bundlePlans: [
      {
        billing_id: 'id1',
        plan: '5M-0817',
        product: 'messaging',
        price: 123,
        overage: 0.3,
        volume: 5000000,
      },
      {
        billing_id: 'id2',
        plan: '2.5M-0817',
        product: 'messaging',
        price: 1234,
        overage: 0.4,
        volume: 2500000,
      },
      {
        plan: 'free500-0419',
        product: 'messaging',
        price: 0,
        volume: 500,
      },
    ],
    bundles: [
      {
        bundle: 'free500-0419',
        status: 'public',
        tier: 'test',
        type: 'messaging',
        products: [
          {
            product: 'messaging',
            plan: 'free500-0419',
          },
        ],
      },
      {
        bundle: '5M-0817',
        status: 'secret',
        tier: 'unlimited',
        type: 'messaging',
        products: [
          {
            product: 'messaging',
            plan: '5M-0817',
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
            product: 'messaging',
            plan: '2.5M-0817',
          },
        ],
      },
    ],
  },
};

describe('Selector: can update billing info', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  it('should return true if on paid plan', () => {
    expect(billingInfo.canUpdateBillingInfoSelector(state)).toEqual(true);
  });

  it('should return true if on free legacy plan', () => {
    expect(
      billingInfo.canUpdateBillingInfoSelector({
        ...initialState,
        account: { subscription: { code: 'ccfree1' }, billing: {} },
      }),
    ).toEqual(true);
  });

  it('should return false if on free plan', () => {
    expect(
      billingInfo.canUpdateBillingInfoSelector({
        ...initialState,
        account: { subscription: { code: 'free500-0419' }, billing: {} },
      }),
    ).toEqual(false);
  });
});

describe('Selector: can change plan', () => {
  it('should return false with a suspension', () => {
    const state = {
      account: { isSuspendedForBilling: true },
    };

    expect(billingInfo.canChangePlanSelector(state)).toEqual(false);
  });

  it('should return false with a pending plan change', () => {
    const state = {
      account: { pending_subscription: {} },
    };

    expect(billingInfo.canChangePlanSelector(state)).toEqual(false);
  });

  it('should return false with a custom plan', () => {
    const state = {
      account: {
        subscription: {
          custom: true,
        },
      },
    };

    expect(billingInfo.canChangePlanSelector(state)).toEqual(false);
  });
});

describe('currentPlanCodeSelector: can select plan code', () => {
  let state;
  beforeEach(() => {
    state = {
      account: { subscription: { code: 'qwe' } },
    };
  });

  it('returns correct plan code', () => {
    expect(billingInfo.currentPlanCodeSelector(state)).toEqual('qwe');
  });
});

describe('selectBillingInfo', () => {
  it('returns the combined billing info state', () => {
    const state = {
      account: { subscription: { code: 'qwe' }, billing: {} },
      billing: {
        plans: [
          { status: 'public', code: '123' },
          { status: 'public', code: 'qwe', isFree: false },
        ],
      },
    };

    expect(Object.keys(billingInfo.selectBillingInfo(state))).toEqual([
      'canUpdateBillingInfo',
      'canChangePlan',
      'canPurchaseIps',
      'currentPlan',
      'onZuoraPlan',
      'plans',
      'isAWSAccount',
      'subscription',
    ]);
  });
});

describe('canPurchaseIps', () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it('returns true when plan can buy ip and has billing setup', () => {
    expect(billingInfo.canPurchaseIps(state)).toBe(true);
  });

  it('returns false when plan can buy ip but billing is not setup', () => {
    expect(
      billingInfo.canPurchaseIps({
        ...initialState,
        account: { subscription: { code: '5M-0817' } },
      }),
    ).toBe(false);
  });

  it('returns true when aws plan can buy ip but billing not setup', () => {
    expect(
      billingInfo.canPurchaseIps({
        ...initialState,
        account: { subscription: { code: 'abcd', type: 'aws' } },
      }),
    ).toBe(true);
  });
});

describe('plan selector', () => {
  let state;

  beforeEach(() => {
    state = initialState;
  });

  describe('selectAvailablePlans', () => {
    it('should return active plans', () => {
      expect(billingInfo.selectAvailablePlans(state)).toMatchSnapshot();
    });

    it('should return active paid plans', () => {
      expect(
        billingInfo.selectAvailablePlans({
          ...initialState,
          account: { subscription: { code: 'abcd', self_serve: false } },
        }),
      ).toMatchSnapshot();
    });

    it('should return active AWS plans', () => {
      expect(
        billingInfo.selectAvailablePlans({
          ...initialState,
          account: { subscription: { code: 'abcd', type: 'aws' } },
        }),
      ).toMatchSnapshot();
    });
  });

  describe('selectVisiblePlans', () => {
    it('should return public plans', () => {
      expect(billingInfo.selectVisiblePlans(state)).toMatchSnapshot();
    });

    it('should return public paid plans', () => {
      expect(
        billingInfo.selectVisiblePlans({
          ...initialState,
          account: { subscription: { code: 'abcd', self_serve: false } },
        }),
      ).toMatchSnapshot();
    });

    it('should return public AWS plans', () => {
      expect(
        billingInfo.selectVisiblePlans({
          ...initialState,
          account: { subscription: { code: 'abcd', type: 'aws' } },
        }),
      ).toMatchSnapshot();
    });
  });

  describe('selectMonthlyRecipientValidationUsage', () => {
    it('returns zero when uage is undefined', () => {
      expect(billingInfo.selectMonthlyRecipientValidationUsage({})).toEqual(0);
    });

    it('returns usage count', () => {
      state = {
        account: {
          rvUsage: {
            recipient_validation: {
              month: {
                used: 999,
              },
            },
          },
        },
      };

      expect(billingInfo.selectMonthlyRecipientValidationUsage(state)).toEqual(999);
    });
  });
});

describe('getBundleTierByPlanCode', () => {
  let state;

  beforeEach(() => {
    state = {
      account: { subscription: { code: '5M-0817' }, billing: {} },

      billing: {
        bundlePlans: [
          {
            billing_id: 'id1',
            plan: '5M-0817',
            product: 'messaging',
            price: 123,
            overage: 0.3,
            volume: 5000000,
          },
          {
            billing_id: 'id2',
            plan: '2.5M-0817',
            product: 'messaging',
            price: 1234,
            overage: 0.4,
            volume: 2500000,
          },
        ],
        bundles: [
          {
            bundle: '5M-0817',
            status: 'secret',
            tier: 'unlimited',
            type: 'messaging',
            products: [
              {
                product: 'messaging',
                plan: '5M-0817',
              },
            ],
          },
          {
            bundle: '2.5M-0817',
            status: 'secret',
            type: 'messaging',
            products: [
              {
                product: 'messaging',
                plan: '2.5M-0817',
              },
            ],
          },
        ],
      },
    };
  });

  it('returns the tier of current plan based on the plancode', () => {
    expect(billingInfo.getBundleTierByPlanCode(state)).toEqual('unlimited');
  });

  it("returns a '' when current plan doesn't have a tier", () => {
    state = {
      ...state,
      account: {
        subscription: { code: '2.5M-0817' },
        billing: {},
      },
    };
    expect(billingInfo.getBundleTierByPlanCode(state)).toEqual('');
  });
});

describe('currentPlanNameSelector', () => {
  it('should return the name of the plan', () => {
    expect(
      billingInfo.currentPlanNameSelector({
        ...initialState,
        account: { subscription: { name: 'The Best Plan Available' } },
      }),
    ).toEqual('The Best Plan Available');
  });
});

describe('selectMonthlyTransmissionUsage', () => {
  it('returns monthly transmissions usage', () => {
    const state = {
      account: {
        subscription: {
          period: 'month',
        },
        usage: {
          year: {
            used: 111,
          },
          month: {
            used: 222,
          },
        },
      },
    };

    expect(billingInfo.selectMonthlyTransmissionsUsage(state)).toEqual(222);
    expect(billingInfo.selectMonthlyTransmissionsUsage(state)).not.toEqual(111);
  });
});

describe('selectEndOfBillingPeriod', () => {
  it('returns the end of the billing period based on the subscription period', () => {
    const state = {
      account: {
        subscription: {
          period: 'month',
        },
        usage: {
          month: {
            end: '04-05-06',
          },
        },
      },
    };

    expect(billingInfo.selectEndOfBillingPeriod(state)).toEqual('2006-04-05T08:00:00.000Z');
  });
});

describe('selectTransmissionsInPlan', () => {
  it('returns the plan volume per period', () => {
    const state = {
      account: {
        subscription: {
          plan_volume_per_period: 1337,
        },
      },
    };

    expect(billingInfo.selectTransmissionsInPlan(state)).toEqual(1337);
  });
});
