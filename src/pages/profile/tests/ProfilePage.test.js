import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';
import { useHibana } from 'src/context/HibanaContext';
import { ProfilePage } from '../ProfilePage';
import NameForm from '../components/NameForm';
import PasswordForm from '../components/PasswordForm';
import { AccessControl } from 'src/components/auth';
import ErrorTracker from 'src/helpers/errorTracker';

jest.mock('src/context/HibanaContext');

let props;
let wrapper;

beforeEach(() => {
  useHibana.mockImplementation(() => [
    { isHibanaEnabled: false, setIsHibanaEnabled: jest.fn(), showAlert: jest.fn() },
  ]);

  props = {
    currentUser: {
      username: 'Lord Stark',
      email: 'ned.stark@winterfell.biz',
      access_level: 'admin',
      is_sso: false,
    },
    updateUser: jest.fn(() => Promise.resolve()),
    getCurrentUser: jest.fn(() => Promise.resolve()),
    confirmPassword: jest.fn(() => Promise.resolve()),
  };

  wrapper = shallow(<ProfilePage {...props} />);
});

const defaultProps = {
  currentUser: {
    username: 'Lord Stark',
    email: 'ned.stark@winterfell.biz',
    access_level: 'admin',
    is_sso: false,
  },
  updateUser: jest.fn(() => Promise.resolve()),
  getCurrentUser: jest.fn(() => Promise.resolve()),
  confirmPassword: jest.fn(() => Promise.resolve()),
};

const subject = props => shallow(<ProfilePage {...defaultProps} {...props} />);

describe('ProfilePage', () => {
  it('renders with verify email banner', () => {
    wrapper.setProps({ currentUser: { email_verified: false, verifyingEmail: true } });
    expect(wrapper).toMatchSnapshot();
  });

  cases(
    'handles the is_sso condition on tfa form',
    ({ is_sso, result }) => {
      const condition = wrapper
        .find(AccessControl)
        .at(2)
        .prop('condition');
      expect(condition({ currentUser: { is_sso }, ready: true })).toEqual(result);
    },
    {
      'is sso': { is_sso: true, result: false },
      'not sso': { is_sso: false, result: true },
    },
  );

  cases(
    'handles the is_sso condition on update password',
    ({ is_sso, result }) => {
      const condition = wrapper
        .find(AccessControl)
        .at(2)
        .prop('condition');
      expect(condition({ currentUser: { is_sso }, ready: true })).toEqual(result);
    },
    {
      'is sso': { is_sso: true, result: false },
      'not sso': { is_sso: false, result: true },
    },
  );

  cases(
    'handles the various account types',
    ({ access_level, result }) => {
      const condition = wrapper
        .find(AccessControl)
        .at(0)
        .prop('condition');

      expect(condition({ currentUser: { access_level }, ready: true })).toEqual(result);
    },
    {
      user: { access_level: 'user', result: true },
      heroku: { access_level: 'heroku', result: false },
      azure: { access_level: 'azure', result: false },
    },
  );

  describe('updateProfile', () => {
    it('should update profile correctly', () => {
      const updatePromise = Promise.resolve();
      const mockUpdateUser = jest.fn(() => updatePromise);
      const mockGetCurrentUser = jest.fn(() => Promise.resolve());
      const wrapper = subject({
        updateUser: mockUpdateUser,
        getCurrentUser: mockGetCurrentUser,
      });

      wrapper.find(NameForm).simulate('submit', { firstName: 'John', lastName: 'Doe' });

      expect(mockUpdateUser).toHaveBeenCalledWith('Lord Stark', {
        first_name: 'John',
        last_name: 'Doe',
      });

      return updatePromise.then(() => {
        expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);
      });
    });

    it('should ignore refetch error, but report error silently', async () => {
      const getCurrentUserError = new Error('wow');
      const getCurrentUserPromise = Promise.reject(getCurrentUserError);
      const mockGetCurrentUser = jest.fn(() => getCurrentUserPromise);
      const mockUpdateUser = jest.fn(() => Promise.resolve());
      const mockReporter = jest.fn();
      const mockErrorTracker = { reporter: mockReporter };
      const errorTrackerSpy = jest.spyOn(ErrorTracker, 'report');

      const wrapper = subject({
        getCurrentUser: mockGetCurrentUser,
        updateUser: mockUpdateUser,
        errorTracker: mockErrorTracker,
      });

      await wrapper.find(NameForm).simulate('submit', { firstName: 'Ryan', lastName: 'Seacrest' });

      expect(mockUpdateUser).toHaveBeenCalledWith('Lord Stark', {
        first_name: 'Ryan',
        last_name: 'Seacrest',
      });
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(1);

      return getCurrentUserPromise.catch(() => {
        expect(errorTrackerSpy).toHaveBeenCalledWith(
          'silent-ignore-refetch-current-user',
          getCurrentUserError,
        );
      });
    });
  });

  describe('updatePassword', () => {
    it('updates password correctly', async () => {
      const mockUpdatePassword = jest.fn(() => Promise.resolve());
      const mockConfirmPassword = jest.fn(() => Promise.resolve());
      const mockUpdateUser = jest.fn(() => Promise.resolve());
      const wrapper = subject({
        updatePassword: mockUpdatePassword,
        confirmPassword: mockConfirmPassword,
        updateUser: mockUpdateUser,
      });

      await wrapper
        .find(PasswordForm)
        .simulate('submit', { currentPassword: '111', newPassword: '222' });

      expect(mockConfirmPassword).toHaveBeenCalledWith('Lord Stark', '111');
      expect(mockUpdateUser).toHaveBeenCalledWith('Lord Stark', { password: '222' });
    });
  });
});
