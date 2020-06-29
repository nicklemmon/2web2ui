import { initializeAccessControl } from '../accessControl';
import { fetch as fetchAccount } from 'src/actions/account';
import { getPlans, getBundles } from 'src/actions/billing';
import { get as getCurrentUser, getGrants } from 'src/actions/currentUser';

jest.mock('src/actions/account');
jest.mock('src/actions/currentUser');
jest.mock('src/actions/billing');

describe('Action: Initialize Access Control', () => {
  const meta = { showErrorAlert: false };
  beforeEach(() => {
    fetchAccount.mockImplementation(() => Promise.resolve('test-account'));
    getPlans.mockImplementation(() => Promise.resolve('test-plans'));
    getBundles.mockImplementation(() => Promise.resolve('test-bundles'));
    getCurrentUser.mockImplementation(() => Promise.resolve({ access_level: 'EQUISAPIEN' }));
    getGrants.mockImplementation(() => Promise.resolve('test-grants'));
  });

  it('should initialize access control with a series of calls', async () => {
    const dispatchMock = jest.fn(a => a);
    await initializeAccessControl()(dispatchMock);

    expect(fetchAccount).toHaveBeenCalledWith({ meta });
    expect(getPlans).toHaveBeenCalledWith({ meta });
    expect(getCurrentUser).toHaveBeenCalledWith({ meta });
    expect(getGrants).toHaveBeenCalledWith({ role: 'EQUISAPIEN', meta });
    expect(dispatchMock).toHaveBeenCalledTimes(6);
    expect(dispatchMock).toHaveBeenLastCalledWith({
      type: 'ACCESS_CONTROL_READY',
    });
  });
});
