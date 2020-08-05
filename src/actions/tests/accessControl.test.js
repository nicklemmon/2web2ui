import { initializeAccessControl } from '../accessControl';
import { fetch as fetchAccount } from 'src/actions/account';
import { getPlans, getBundles, getSubscription } from 'src/actions/billing';
import { get as getCurrentUser, getGrants } from 'src/actions/currentUser';

jest.mock('src/actions/account');
jest.mock('src/actions/currentUser');
jest.mock('src/actions/billing');

describe('Action: Initialize Access Control', () => {
  const meta = { showErrorAlert: false };
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn(a => Promise.resolve(a));
    fetchAccount.mockImplementation(() => Promise.resolve('test-account'));
    getPlans.mockImplementation(() => Promise.resolve('test-plans'));
    getBundles.mockImplementation(() => Promise.resolve('test-bundles'));
    getCurrentUser.mockImplementation(() => Promise.resolve({ access_level: 'admin' }));
    getGrants.mockImplementation(() => Promise.resolve('test-grants'));
    getSubscription.mockImplementation(() => Promise.resolve('test-subscription'));
  });

  it('should initialize access control with a series of calls for non heroku and non azure users', async () => {
    const thunk = initializeAccessControl();
    const state = { currentUser: { access_level: 'admin' } };

    await thunk(dispatch, () => state);
    expect(getCurrentUser).toHaveBeenCalledWith({ meta });
    expect(getGrants).toHaveBeenCalledWith({ role: 'admin', meta });
    expect(fetchAccount).toHaveBeenCalledWith({ meta });
    expect(getPlans).toHaveBeenCalledWith({ meta });
    expect(getBundles).toHaveBeenCalledWith({ meta });
    expect(getSubscription).toHaveBeenCalledWith({ meta });
    expect(dispatch).toHaveBeenCalledTimes(7);
  });
  it('should initialize access control with a series of calls for heroku users', async () => {
    getCurrentUser.mockImplementation(() => Promise.resolve({ access_level: 'heroku' }));
    const thunk = initializeAccessControl();
    const state = { currentUser: { access_level: 'heroku' } };

    await thunk(dispatch, () => state);
    expect(getCurrentUser).toHaveBeenCalledWith({ meta });
    expect(getGrants).toHaveBeenCalledWith({ role: 'heroku', meta });
    expect(fetchAccount).toHaveBeenCalledWith({ meta });
    expect(getPlans).toHaveBeenCalledWith({ meta });
    expect(getBundles).toHaveBeenCalledWith({ meta });
    expect(getSubscription).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(6);
  });

  it('should initialize access control with a series of calls for aws users', async () => {
    const thunk = initializeAccessControl();
    const state = {
      currentUser: { access_level: 'admin' },
      account: { subscription: { type: 'aws' } },
    };

    await thunk(dispatch, () => state);
    expect(getCurrentUser).toHaveBeenCalledWith({ meta });
    expect(getGrants).toHaveBeenCalledWith({ role: 'admin', meta });
    expect(fetchAccount).toHaveBeenCalledWith({ meta });
    expect(getPlans).toHaveBeenCalledWith({ meta });
    expect(getBundles).toHaveBeenCalledWith({ meta });
    expect(getSubscription).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(6);
  });
});
