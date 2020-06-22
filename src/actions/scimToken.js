import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function generateScimToken() {
  return sparkpostApiRequest({
    type: 'GENERATE_SCIM_TOKEN',
    meta: {
      method: 'POST',
      url: '/v1/api-keys',
      data: {
        label: 'SCIM Token',
        grants: ['scim/manage'],
        userless: true, // true; if the API key is not tied to a user
      },
    },
  });
}

export function listScimToken() {
  return sparkpostApiRequest({
    type: 'LIST_SCIM_TOKEN',
    meta: {
      method: 'GET',
      url: '/v1/api-keys',
      params: {
        grant: 'scim/manage',
      },
      showErrorAlert: false,
    },
  });
}

export function deleteScimToken({ id, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);
  return sparkpostApiRequest({
    type: 'DELETE_API_KEY',
    meta: {
      method: 'DELETE',
      url: `/v1/api-keys/${id}`,
      headers,
    },
  });
}
