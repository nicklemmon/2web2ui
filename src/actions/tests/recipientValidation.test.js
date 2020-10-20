import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import {
  uploadList,
  singleAddress,
  getJobStatus,
  getList,
  triggerJob,
} from '../recipientValidation';

jest.mock('src/actions/helpers/sparkpostApiRequest');

describe('Recipient Verification Actions', () => {
  snapshotActionCases('.uploadList', [
    {
      name: 'when uploading csv',
      actionCreator: () =>
        uploadList({
          data: 'csv-file',
        }),
    },
  ]);

  snapshotActionCases('.singleAddress', [
    {
      name: 'when verifying a single address',
      actionCreator: () =>
        singleAddress({
          address: 'foo@bar.com',
        }),
    },
  ]);

  snapshotActionCases('.getJobStatus', [
    {
      name: 'when getting status of a list job',
      actionCreator: () => getJobStatus('12345'),
    },
  ]);

  snapshotActionCases('.getList', [
    {
      name: 'when getting list of jobs',
      actionCreator: () => getList(),
    },
  ]);

  snapshotActionCases('.triggerJob', [
    {
      name: 'when triggering a job to be processed',
      actionCreator: () => triggerJob('12345'),
    },
  ]);
});
