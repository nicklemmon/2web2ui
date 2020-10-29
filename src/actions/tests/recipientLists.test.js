import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  listRecipientLists,
  createRecipientList,
  updateRecipientList,
  deleteRecipientList,
  getRecipientList,
} from '../recipientLists';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Recipient List Actions', () => {
  snapshotActionCases('.createRecipientList', [
    {
      name: 'when uploading csv',
      actionCreator: () =>
        createRecipientList({
          data: 'csv-file',
        }),
    },
  ]);

  snapshotActionCases('.listRecipientLists', [
    {
      name: 'when list is not loaded',
      actionCreator: () => listRecipientLists(),
      state: {
        recipientLists: {
          listLoaded: false,
        },
      },
    },
  ]);

  snapshotActionCases('.updateRecipientList', [
    {
      name: 'when passing and id',
      actionCreator: () =>
        updateRecipientList({
          id: 'update-me',
        }),
    },
  ]);

  snapshotActionCases('.deleteRecipientList', [
    {
      name: 'when passing and id',
      actionCreator: () =>
        deleteRecipientList({
          id: 'delete-me',
        }),
    },
  ]);

  snapshotActionCases('.getRecipientList', [
    {
      name: 'when passing and id',
      actionCreator: () =>
        getRecipientList({
          id: 'get-me',
        }),
    },
  ]);
});
