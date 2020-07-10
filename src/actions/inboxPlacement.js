import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { PLACEMENT_FILTER_TYPES } from 'src/pages/inboxPlacement/constants/types';

export function listTests() {
  return sparkpostApiRequest({
    type: 'LIST_TESTS',
    meta: {
      method: 'GET',
      url: '/v1/inbox-placement',
      showErrorAlert: false,
    },
  });
}

export function getSeedList() {
  return sparkpostApiRequest({
    type: 'GET_SEEDS',
    meta: {
      method: 'GET',
      url: '/v1/inbox-placement/seeds',
    },
  });
}

export const getInboxPlacementTrends = queryParams =>
  sparkpostApiRequest({
    type: 'GET_INBOX_PLACEMENT_TRENDS',
    meta: {
      method: 'GET',
      url: '/v1/inbox-placement/message-trends',
      params: queryParams,
    },
  });

export const getInboxPlacementTrendsFilterValues = queryParams =>
  sparkpostApiRequest({
    type: 'GET_INBOX_PLACEMENT_TRENDS_FILTER_VALUES',
    meta: {
      method: 'GET',
      url: '/v1/inbox-placement/message-trends/filter-values',
      params: queryParams,
    },
  });

export const getInboxPlacementTest = id =>
  sparkpostApiRequest({
    type: 'GET_INBOX_PLACEMENT_TEST',
    meta: {
      method: 'GET',
      url: `/v1/inbox-placement/${id}`,
    },
  });

export const getInboxPlacementByProvider = id =>
  getInboxPlacementData(
    id,
    PLACEMENT_FILTER_TYPES.MAILBOX_PROVIDER,
    'GET_INBOX_PLACEMENT_TESTS_BY_MAILBOX_PROVIDER',
  );

export const getInboxPlacementByRegion = id =>
  getInboxPlacementData(id, PLACEMENT_FILTER_TYPES.REGION, 'GET_INBOX_PLACEMENT_TESTS_BY_REGION');

export const getInboxPlacementBySendingIp = id =>
  getInboxPlacementData(
    id,
    PLACEMENT_FILTER_TYPES.SENDING_IP,
    'GET_INBOX_PLACEMENT_TESTS_BY_SENDING_IP',
  );

export const getInboxPlacementData = (id, type, action) =>
  sparkpostApiRequest({
    type: action,
    meta: {
      method: 'GET',
      url: `/v1/inbox-placement/${id}/${type}`,
    },
  });

export function getInboxPlacementTestContent(id) {
  return sparkpostApiRequest({
    type: 'GET_INBOX_PLACEMENT_TEST_CONTENT',
    meta: {
      method: 'GET',
      url: `/v1/inbox-placement/${id}/content`,
    },
  });
}

export function getAllInboxPlacementMessages(id, filters) {
  return sparkpostApiRequest({
    type: 'GET_ALL_INBOX_PLACEMENT_MESSAGES',
    meta: {
      method: 'GET',
      url: `/v1/inbox-placement/${id}/messages`,
      params: filters,
      showErrorAlert: false,
    },
  });
}

export function resetState() {
  return dispatch =>
    dispatch({
      type: 'RESET_INBOX_PLACEMENT',
    });
}

export function getInboxPlacementMessage(testId, messageId) {
  return sparkpostApiRequest({
    type: 'GET_INBOX_PLACEMENT_MESSAGE',
    meta: {
      method: 'GET',
      url: `/v1/inbox-placement/${testId}/messages/${messageId}`,
      context: {
        messageId,
      },
    },
  });
}
