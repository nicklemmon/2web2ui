import * as passwordReset from '../passwordReset';
import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';
jest.mock('src/helpers/axiosInstances');

describe('Action Creator: Password', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    sparkpostRequest.mockImplementation((a) => Promise.resolve(a));
  });

  describe('sendPasswordResetEmail', () => {
    it('sends with username', async () => {
      const thunk = passwordReset.sendPasswordResetEmail({ user: 'username' });
      await thunk(dispatchMock);
      expect(sparkpostRequest).toHaveBeenCalledWith({
        data: { username: 'username' },
        method: 'POST',
        url: '/v1/users/password/forgot'
      });
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });

    it('sends with email', async () => {
      const thunk = passwordReset.sendPasswordResetEmail({ user: 'user@email.com' });
      await thunk(dispatchMock);
      expect(sparkpostRequest).toHaveBeenCalledWith({
        data: { email: 'user@email.com' },
        method: 'POST',
        url: '/v1/users/password/forgot'
      });
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });

    it('handles error', async () => {
      sparkpostRequest.mockImplementation(() => Promise.reject('error'));
      const thunk = passwordReset.sendPasswordResetEmail({ user: 'user@email.com' });
      await thunk(dispatchMock);
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });
  });

  describe('resetPassword', () => {
    it('handles success', async () => {
      const thunk = passwordReset.resetPassword({ password: '12345', token: 'faketoken' });
      await thunk(dispatchMock);
      expect(sparkpostRequest).toHaveBeenCalledWith({
        data: { password: '12345' },
        method: 'POST',
        headers: { Authorization: 'faketoken' },
        url: '/v1/users/password/reset'
      });
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });

    it('handles error', async () => {
      sparkpostRequest.mockImplementation(() => Promise.reject('error'));
      const thunk = passwordReset.resetPassword({ password: '12345', token: 'faketoken' });
      await thunk(dispatchMock);
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });
  });
});
