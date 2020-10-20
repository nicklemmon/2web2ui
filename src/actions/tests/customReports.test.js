import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as actions from '../customReports';

jest.mock('../helpers/sparkpostApiRequest');

describe('Action Creator: Custom Reports', () => {
  let mockStore;

  function getArgs(mock) {
    return mock.getActions()[0].meta.data.options.ui;
  }

  describe('with existing reports', () => {
    beforeEach(() => {
      mockStore = createMockStore({
        currentUser: {
          username: 'testname',
          options: {
            ui: {
              customReports: [
                { name: 'report foo', url: 'test-url' },
                { name: 'report bar', url: 'test-url' },
              ],
            },
          },
        },
      });
    });

    it('should dispatch a save report action', () => {
      mockStore.dispatch(
        actions.saveReport({
          name: 'report bar',
          url: 'test-url-overwrite',
        }),
      );

      expect(getArgs(mockStore)).toEqual({
        customReports: [
          { name: 'report foo', url: 'test-url' },
          { name: 'report bar', url: 'test-url-overwrite' },
        ],
      });
    });

    it('should dispatch a delete report action', () => {
      mockStore.dispatch(actions.deleteReport('report foo'));
      expect(getArgs(mockStore)).toEqual({
        customReports: [{ name: 'report bar', url: 'test-url' }],
      });
    });
  });

  describe('with no reports', () => {
    beforeEach(() => {
      mockStore = createMockStore({
        currentUser: { username: 'testname' },
      });
    });

    it('should dispatch a save report action', () => {
      mockStore.dispatch(
        actions.saveReport({
          name: 'report foo',
          url: 'test-url-baz',
        }),
      );
      expect(getArgs(mockStore)).toEqual({
        customReports: [{ name: 'report foo', url: 'test-url-baz' }],
      });
    });

    it('should dispatch a delete report action', () => {
      mockStore.dispatch(actions.deleteReport('report foo'));
      expect(getArgs(mockStore)).toEqual({
        customReports: false,
      });
    });
  });
});
