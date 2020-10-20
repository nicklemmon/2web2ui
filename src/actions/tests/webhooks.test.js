import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as webhooks from '../webhooks';

jest.mock('../helpers/sparkpostApiRequest');

describe('Action Creator: Webhooks', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({});
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(webhooks.listWebhooks());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get action', () => {
    mockStore.dispatch(webhooks.getWebhook({ id: 100 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get action with sub', () => {
    mockStore.dispatch(webhooks.getWebhook({ id: 100, subaccount: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create action', () => {
    mockStore.dispatch(webhooks.createWebhook({ name: 'a webhook' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update action', () => {
    mockStore.dispatch(webhooks.updateWebhook({ id: '123', name: 'another webhook' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a delete action', () => {
    mockStore.dispatch(webhooks.deleteWebhook({ id: '123' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a test action', () => {
    mockStore.dispatch(webhooks.testWebhook({ id: '123', message: 'request message' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get batches action', () => {
    mockStore.dispatch(webhooks.getBatches({ id: '123', message: 'request message' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a getEventDocs action', () => {
    mockStore.dispatch(webhooks.getEventDocs());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a getEventSamples action', () => {
    mockStore.dispatch(webhooks.getEventSamples(['event1', 'event2']));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
