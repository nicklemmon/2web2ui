import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as bounceReport from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');

describe('Action Creator: Bounce Report', () => {

  let dispatchMock;
  let getStateMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  it('should dispatch a refresh action', async () => {
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_bounce: 1 }]);
    const thunk = bounceReport.refresh();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });
});
