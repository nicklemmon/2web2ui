import { createMockStore } from 'src/__testHelpers__/mockStore';

import * as sendingIps from '../sendingIps';

jest.mock('../helpers/sparkpostApiRequest');

describe('Action Creator: Sending IPs', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({});
  });

  describe('updateSendingIp', () => {
    it('dispatches update action', async () => {
      await mockStore.dispatch(sendingIps.updateSendingIp('1.1.1.1', { ip_pool: 'foos' }));
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('list', () => {
    it('dispatches list action', async () => {
      await mockStore.dispatch(sendingIps.list());
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });
});
