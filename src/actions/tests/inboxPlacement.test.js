import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as inboxPlacement from '../inboxPlacement';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn(a => a));

describe('Action Creator: Inbox Placement', () => {
  it('it makes request to seed', async () => {
    await inboxPlacement.getSeedList();
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_SEEDS',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/seeds',
      },
    });
  });

  it('it makes request to list tests', async () => {
    await inboxPlacement.listTests();
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'LIST_TESTS',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement',
        showErrorAlert: false,
      },
    });
  });

  it('it makes request to list tests by mailbox provider', async () => {
    await inboxPlacement.getInboxPlacementByProvider(101);
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TESTS_BY_MAILBOX_PROVIDER',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/101/mailbox-provider',
      },
    });
  });

  it('it makes request to list tests by region', async () => {
    await inboxPlacement.getInboxPlacementByRegion(101);
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TESTS_BY_REGION',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/101/region',
      },
    });
  });

  it('it makes request to list tests by sending ip', async () => {
    await inboxPlacement.getInboxPlacementBySendingIp(101);
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TESTS_BY_SENDING_IP',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/101/sending-ip',
      },
    });
  });

  it('it makes request to get trends', async () => {
    await inboxPlacement.getInboxPlacementTrends({ myparams: 'foo' });
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TRENDS',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/message-trends',
        params: { myparams: 'foo' },
      },
    });
  });

  it('it makes request to get trends filter values', async () => {
    await inboxPlacement.getInboxPlacementTrendsFilterValues({ myparams: 'foo' });
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TRENDS_FILTER_VALUES',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/message-trends/filter-values',
        params: { myparams: 'foo' },
      },
    });
  });

  it('makes request to get single inbox placement test', async () => {
    await inboxPlacement.getInboxPlacementTest(1);
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TEST',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/1',
      },
    });
  });

  it('makes request to get single inbox placement test content', async () => {
    await inboxPlacement.getInboxPlacementTestContent(1);
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_TEST_CONTENT',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/1/content',
      },
    });
  });

  it('makes request to get all messages with filter', async () => {
    await inboxPlacement.getAllInboxPlacementMessages(1, { 'mailbox-provider': 'sparkpost.com' });
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_ALL_INBOX_PLACEMENT_MESSAGES',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/1/messages',
        params: { 'mailbox-provider': 'sparkpost.com' },
        showErrorAlert: false,
      },
    });
  });

  it('makes request to reset state', () => {
    const dispatchMock = jest.fn(a => a);
    const action = inboxPlacement.resetState()(dispatchMock);
    expect(action).toEqual({ type: 'RESET_INBOX_PLACEMENT' });
  });

  it('makes request to get a specific message', async () => {
    await inboxPlacement.getInboxPlacementMessage(1, 101);
    expect(sparkpostApiRequest).toHaveBeenCalledWith({
      type: 'GET_INBOX_PLACEMENT_MESSAGE',
      meta: {
        method: 'GET',
        url: '/v1/inbox-placement/1/messages/101',
        context: {
          messageId: 101,
        },
      },
    });
  });
});
