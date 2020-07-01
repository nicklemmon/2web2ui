import selectAccessCondtionState, { selectCondition } from '../accessConditionState';

jest.mock('src/helpers/conditions/account');

describe('Selector: Access Condition State', () => {
  let testState;
  let testAccessConditionState;

  beforeEach(() => {
    testState = {
      account: {
        subscription: {
          code: '5M-0817',
        },
      },
      billing: {
        subscription: {
          bill_cycle_day: 5,
          pending_downgrades: [],
          products: [
            {
              product: 'messaging',
              plan: '5M-0817',
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
      currentUser: {},
      accessControlReady: false,
    };

    testAccessConditionState = {
      account: testState.account,
      currentUser: testState.currentUser,
      accountPlan: {
        billingId: 'id1',
        billing_id: 'id1',
        bundle: '5M-0817',
        code: '5M-0817',
        includesIp: true,
        isFree: false,
        overage: 0.3,
        plan: '5M-0817',
        price: 123,
        product: 'messaging',
        products: [{ plan: '5M-0817', product: 'messaging' }],
        status: 'secret',
        tier: 'unlimited',
        type: 'messaging',
        volume: 5000000,
      },
      plans: testState.billing.bundlePlans,
      ready: false,
    };
  });

  test('default selector should return the correct state', () => {
    expect(selectAccessCondtionState(testState)).toEqual(testAccessConditionState);
  });

  test('selectCondition should provide correct state to passed in condition', () => {
    const testCondition = jest.fn(() => true);
    expect(selectCondition(testCondition)(testState)).toEqual(true);
    expect(testCondition).toHaveBeenCalledWith(testAccessConditionState);
  });
});
