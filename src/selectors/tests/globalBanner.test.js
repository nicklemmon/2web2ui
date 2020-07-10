import { selectTargetBanner } from '../globalBanner';

describe('globalBanner selectors', () => {
  describe('selectTargetBanner', () => {
    jest.mock('moment', () => '2020-04-10T08:00:00.000Z');

    it('returns "pending-cancellation" when the user\'s account is pending cancellation, fewer than 7 days remain before cancellation is in effect', () => {
      const state = {
        account: {
          pending_cancellation: {
            effective_date: '2020-04-13T08:00:00.000Z',
          },
        },
      };

      const props = {
        location: {
          pathname: '/dashboard',
        },
      };

      expect(selectTargetBanner(state, props)).toBe('pending-cancellation');
    });

    it('returns "pending-cancellation" when the user\'s account is pending cancellation and the user is on a certain path', () => {
      const state = {
        account: {
          pending_cancellation: {
            effective_date: '2020-10-13T08:00:00.000Z',
          },
        },
      };

      const props = {
        location: {
          pathname: '/account/settings',
        },
      };

      expect(selectTargetBanner(state, props)).toBe('pending-cancellation');
    });

    it('returns "upgrade" when the account state is on a free plan', () => {
      const state = {
        account: {
          subscription: {
            code: 'free500-0419',
          },
        },
        billing: {
          bundlePlans: [
            {
              plan: 'free500-0419',
            },
          ],
        },
      };

      const props = {
        location: {
          pathname: '/content/templates',
        },
      };

      expect(selectTargetBanner(state, props)).toBe('upgrade');
    });

    it('returns "upgrade" when the account state is on a free, European, plan', () => {
      const state = {
        account: {
          subscription: {
            code: 'free500-SPCEU-0419',
          },
        },
        billing: {
          bundlePlans: [
            {
              plan: 'free500-SPCEU-0419',
            },
          ],
        },
      };

      const props = {
        location: {
          pathname: '/content/templates',
        },
      };

      expect(selectTargetBanner(state, props)).toBe('upgrade');
    });
  });

  it('does not return "upgrade" when the account is pending cancellation', () => {
    const state = {
      account: {
        pending_cancellation: {
          effective_date: '2020-08-23-T08:00:00.000Z',
        },
        subscription: {
          code: 'free500-0419',
        },
      },
      billing: {
        plans: [
          {
            code: 'free500-0419',
          },
        ],
      },
    };

    const props = {
      location: {
        pathname: '/dashboard',
      },
    };

    expect(selectTargetBanner(state, props)).not.toBe('upgrade');
  });
});
