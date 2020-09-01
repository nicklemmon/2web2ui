import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { segmentTrack, SEGMENT_EVENTS } from 'src/helpers/segment';

export function fetch({ meta = {}, ...params } = {}) {
  return sparkpostApiRequest({
    type: 'FETCH_ACCOUNT',
    meta: {
      method: 'GET',
      url: '/v1/account',
      ...meta,
      params,
    },
  });
}

export function getUsage() {
  return sparkpostApiRequest({
    type: 'GET_USAGE',
    meta: {
      method: 'GET',
      url: '/v1/usage',
    },
  });
}

export function getBillingInfo({ meta = {} } = {}) {
  return sparkpostApiRequest({
    type: 'GET_BILLING',
    meta: {
      method: 'GET',
      url: '/v1/billing',
      ...meta,
    },
  });
}

export function update(data) {
  return sparkpostApiRequest({
    type: 'UPDATE_ACCOUNT',
    meta: {
      method: 'PUT',
      url: '/v1/account',
      data,
    },
  });
}

export function setAccountOption(key, value) {
  return sparkpostApiRequest({
    type: 'SET_ACCOUNT_OPTION',
    meta: {
      method: 'PUT',
      url: '/v1/account',
      data: {
        options: {
          ui: {
            [key]: value,
          },
        },
      },
    },
  });
}

export function register(data) {
  return sparkpostApiRequest({
    type: 'CREATE_ACCOUNT',
    meta: {
      method: 'POST',
      url: '/v1/account',
      data,
    },
  });
}

export function emailRequest(data) {
  return sparkpostApiRequest({
    type: 'EMAIL_REQUEST',
    meta: {
      method: 'POST',
      url: '/v1/account/email-request',
      data,
    },
  });
}

export function cancelAccount() {
  return (dispatch, getState) => {
    const state = getState();
    return dispatch(
      sparkpostApiRequest({
        type: 'CANCEL_ACCOUNT',
        meta: {
          method: 'POST',
          url: '/v1/account/cancellation-request',
          onSuccess: () => {
            segmentTrack(SEGMENT_EVENTS.ACCOUNT_CANCELLED, {
              customer_id: state.account.customer_id,
            });
          },
        },
      }),
    );
  };
}

export function renewAccount() {
  return sparkpostApiRequest({
    type: 'RENEW_ACCOUNT',
    meta: {
      method: 'DELETE',
      url: '/v1/account/cancellation-request',
    },
  });
}
