import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as templates from '../templates';
import * as templatesHelpers from '../helpers/templates';
import _ from 'lodash';

jest.mock('../helpers/sparkpostApiRequest');

describe('Action Creator: Templates', () => {
  let mockStore;
  let dispatchMock;

  const user = {
    currentUser: {
      username: 'user',
    },
  };

  beforeEach(async () => {
    templatesHelpers.getTestDataKey = jest.fn(() => 'key');
    dispatchMock = jest.fn(a => Promise.resolve(a));
    mockStore = createMockStore(user);
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(templates.listTemplates());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get draft action', () => {
    mockStore.dispatch(templates.getDraft('one'));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get published action', () => {
    mockStore.dispatch(templates.getPublished('two'));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a delete action', () => {
    mockStore.dispatch(templates.deleteTemplate({ id: 'three' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create action', () => {
    const data = {
      id: 'id',
      parsedTestData: { test: 'data' },
      form: 'data',
      sharedWithSubaccounts: false,
    };
    mockStore.dispatch(templates.create(data));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update action', async () => {
    const data = {
      id: 'id',
      parsedTestData: { test: 'data' },
      form: 'data',
    };
    const thunk = templates.update(data);
    await thunk(dispatchMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a publish action', async () => {
    const data = {
      id: 'id',
      parsedTestData: { test: 'data' },
      form: 'data',
    };
    const thunk = templates.publish(data);
    await thunk(dispatchMock);
    expect(_.flatten(dispatchMock.mock.calls)).toMatchSnapshot();
  });

  it('should dispatch a getPreview action', async () => {
    const action = templates.getPreview({
      content: {
        html: '<h1>Test Draft</h1>',
        subject: 'Test Draft',
      },
      id: 'test-template',
      mode: 'draft',
    });
    await mockStore.dispatch(action);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch getTestData and sendPreview actions', async () => {
    const action = templates.sendPreview({
      emails: ['test@example.com'],
      from: 'test@sparkpostbox.com',
      id: 'test-template',
      mode: 'draft',
    });
    await mockStore.dispatch(action);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  describe('create', () => {
    it('dispatches create template with passed in data', async () => {
      const action = templates.create({
        id: 'my-id',
        subaccount: 123,
        content: {
          html: '<p>Hello world</p>',
        },
        testData: {
          substitution_data: {},
          options: {},
          metadata: {},
        },
        sharedWithSubaccounts: true,
      });

      await mockStore.dispatch(action);
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('update', () => {
    it('dispatches update template with passed in data', async () => {
      const action = templates.update({
        id: 'my-new-id',
        content: {
          html: '<p>My new content.</p>',
        },
        testData: {
          options: {},
          substitution_data: {
            foo: 'bar',
          },
        },
      });

      await mockStore.dispatch(action);
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('publish', () => {
    it('dispatches the publish action with passed in data', async () => {
      const data = {
        id: 'foo',
        testData: {
          options: {},
          substitution_data: {
            hello: 'world',
          },
          metadata: {},
        },
      };
      const action = templates.publish(data, 123);

      await mockStore.dispatch(action);
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('deleteTemplate', () => {
    it('dispatches delete template with the passed in ID and subaccount', async () => {
      const action = templates.deleteTemplate('foo', 123);

      await mockStore.dispatch(action);
      expect(mockStore.getActions()).toMatchSnapshot();
    });
  });

  describe('setTestData', () => {
    it('updates local storage with passed in data by invoking localStorage.setItem', async () => {
      const data = {
        options: {},
        substitution_data: {
          foo: 'bar',
        },
        metadata: {},
      };

      await mockStore.dispatch(
        templates.setTestData({
          data,
          id: 'foo',
          mode: 'draft',
        }),
      );

      expect(window.localStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(data));
    });
  });

  describe('deleteTestData', () => {
    it('removes an item from local storage based on the passed in ID', async () => {
      await mockStore.dispatch(templates.deleteTestData({ id: 'foo' }));

      expect(window.localStorage.removeItem).toHaveBeenCalledWith('key');
    });
  });

  describe('getTestData', () => {
    it('retrieves an item from local storage by invoking localStorage.getItem', async () => {
      await mockStore.dispatch(templates.getTestData({ id: 'foo', mode: 'draft' }));

      expect(window.localStorage.getItem).toHaveBeenCalledWith('key');
    });
  });
});
