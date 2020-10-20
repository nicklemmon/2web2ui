import { fetch, register, emailRequest, getBillingInfo, getUsage } from '../account';
jest.mock('../helpers/sparkpostApiRequest');

test('fetch - no params', () => {
  const fetchAction = fetch();
  expect(fetchAction).toMatchSnapshot();
});

test('fetch with params', () => {
  const fetchAction = fetch({
    this: 'one',
    also: 'that one',
    meta: { onSuccess: jest.fn() },
  });

  expect(fetchAction).toMatchSnapshot();
});

test('getBilling', () => {
  const getBillingInfoAction = getBillingInfo();
  expect(getBillingInfoAction).toMatchSnapshot();
});

test('getUsage', () => {
  const getUsageAction = getUsage();
  expect(getUsageAction).toMatchSnapshot();
});

describe('Account action creators', () => {
  describe('register', () => {
    let data;
    beforeEach(() => {
      data = {
        first_name: 'foo',
        last_name: 'bar',
        email: 'foo@bar.com',
        passowrd: 'foobar',
        tou_accepted: true,
        recaptcha_response: 'foofoo',
        recaptcha_type: 'invisible',
      };
    });
    it('makes api call with passed data', () => {
      expect(register(data)).toMatchSnapshot();
    });
  });

  describe('emailRequest', () => {
    let data;
    beforeEach(() => {
      data = {
        limit: 50000,
        previousLimit: '1000',
        template_id: 'daily-limit-increase',
        campaign_id: 'support-daily-limit-increase',
        reason: 'just because i want',
      };
    });
    it('makes api call with correct data', () => {
      expect(emailRequest(data)).toMatchSnapshot();
    });
  });
});
