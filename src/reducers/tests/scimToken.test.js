import scimTokenReducer from '../scimToken';
import cases from 'jest-in-case';

cases(
  'Reducer: ScimToken',
  ({ name, ...action }) => {
    expect(scimTokenReducer(undefined, action)).toMatchSnapshot();
  },
  {
    'when scim token list failed to load': {
      type: 'LIST_SCIM_TOKEN_FAIL',
      payload: new Error('Oh no!'),
    },
    'when scim token list loaded': {
      type: 'LIST_SCIM_TOKEN_SUCCESS',
      payload: [
        {
          id: 'oldid',
          label: 'SCIM Token',
          short_key: 'old1',
          grants: ['scim/manage'],
          created_at: '2019-06-18T20:50:12.164Z',
          username: 'someuser',
        },
      ],
    },
    'when scim token list is pending': {
      type: 'LIST_SCIM_TOKEN_PENDING',
    },
    'when generate scim token failed': {
      type: 'GENERATE_SCIM_TOKEN_FAIL',
      payload: new Error('Oh no!'),
    },
    'when generate scim token is pending': {
      type: 'GENERATE_SCIM_TOKEN_PENDING',
    },
    'when generate scim token succeeds': {
      type: 'GENERATE_SCIM_TOKEN_SUCCESS',
      payload: {
        key: 'this-is-a-fake-api-key',
        short_key: '123f',
        label: 'Send Email Key (auto-generated)',
        link: { href: '/api/v1/api-keys/mock-url-to-api-key' },
      },
    },
    'when delete scim token is pending': {
      type: 'DELETE_SCIM_TOKEN_PENDING',
    },
    'when delete scim token succeeds': {
      type: 'DELETE_SCIM_TOKEN_SUCCESS',
    },
    'when delete scim token fails': {
      type: 'DELETE_SCIM_TOKEN_FAIL',
    },
  },
);
