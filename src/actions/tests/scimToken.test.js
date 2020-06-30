import * as scimTokenRequests from '../scimToken';
jest.mock('src/helpers/axiosInstances');
jest.mock('../helpers/sparkpostApiRequest', () => jest.fn(a => a));

describe('Action Creator: scimToken', () => {
  it('generateScimToken should make the appropriate request', () => {
    const thunk = scimTokenRequests.generateScimToken();
    expect(thunk).toMatchSnapshot();
  });

  it('listScimToken should make the appropriate request', () => {
    const thunk = scimTokenRequests.listScimToken();
    expect(thunk).toMatchSnapshot();
  });

  it('deleteScimToken should make the appropriate request', () => {
    const thunk = scimTokenRequests.deleteScimToken({ id: 'fake-id' });
    expect(thunk).toMatchSnapshot();
  });

  it('resetScimTokenError should make the appropriate request', () => {
    const thunk = scimTokenRequests.resetScimTokenErrors();
    expect(thunk).toMatchSnapshot();
  });
});
