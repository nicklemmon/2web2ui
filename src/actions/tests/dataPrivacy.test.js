import * as dataPrivacyRequests from '../dataPrivacy';
jest.mock('src/helpers/axiosInstances');
jest.mock('../helpers/sparkpostApiRequest');

describe('Action Creator: dataPrivacy', () => {
  it('submitRTBFRequest should make the appropriate request', () => {
    const thunk = dataPrivacyRequests.submitRTBFRequest({
      subaccountId: 100,
      recipients: ['fakeAddress@email.com'],
      include_subaccounts: false,
    });
    expect(thunk).toMatchSnapshot();
  });

  it('submitOptOutRequest should make the appropriate request', () => {
    const thunk = dataPrivacyRequests.submitOptOutRequest({
      subaccountId: 100,
      recipients: ['fakeAddress@email.com'],
      include_subaccounts: false,
    });
    expect(thunk).toMatchSnapshot();
  });
});
