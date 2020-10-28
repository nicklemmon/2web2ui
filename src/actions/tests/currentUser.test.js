import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../currentUser';

jest.mock('src/actions/helpers/sparkpostApiRequest');

snapshotActionCases('Action: Current User', {
  get: {
    actionCreator: actions.get,
    state: {
      auth: {
        username: 'bkemper',
      },
    },
  },
  'getGrantsFromCookie without grants': {
    actionCreator: () => actions.getGrantsFromCookie({}),
  },
  'getGrantsFromCookie with grants': {
    actionCreator: () => actions.getGrantsFromCookie({ grants: ['test/grant'] }),
  },
  'updateUserUIOptions with updates': {
    actionCreator: () => actions.updateUserUIOptions({ example: 'test' }),
    state: {
      currentUser: {
        username: 'bkemper',
      },
    },
  },
});
