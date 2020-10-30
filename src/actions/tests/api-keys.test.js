import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../api-keys';

jest.mock('../helpers/sparkpostApiRequest');
const TEST_GRANTS = ['metrics/read', 'webhooks/modify'];

snapshotActionCases('Action Creator: Api Keys', [
  {
    name: 'listApiKeys (no subaccount specified)',
    actionCreator: actions.listApiKeys,
  },
  {
    name: 'listApiKeys (with subaccount specified)',
    actionCreator: () => actions.listApiKeys(1234),
  },
  {
    name: 'listGrants',
    actionCreator: actions.listGrants,
  },
  {
    name: 'createApiKey (no subaccount)',
    actionCreator: () =>
      actions.createApiKey({
        grants: TEST_GRANTS,
        label: 'test label',
        validIps: ['1.1.1.1', '2.2.2.2'],
      }),
  },
  {
    name: 'createApiKey (with subaccount)',
    actionCreator: () =>
      actions.createApiKey({
        grants: TEST_GRANTS,
        label: 'test label with subaccount',
        subaccount: 1234,
        validIps: ['1.1.1.1', '2.2.2.2'],
      }),
  },
  {
    name: 'getApiKey (no subaccount)',
    actionCreator: () =>
      actions.getApiKey({
        id: 'ABC123ID',
      }),
  },
  {
    name: 'getApiKey (with subaccount)',
    actionCreator: () =>
      actions.getApiKey({
        id: 'ABC123ID',
        subaccount: 1234,
      }),
  },
  {
    name: 'deleteApiKey (no subaccount)',
    actionCreator: () =>
      actions.deleteApiKey({
        id: 'ABC123ID',
      }),
  },
  {
    name: 'deleteApiKey (with subaccount)',
    actionCreator: () =>
      actions.deleteApiKey({
        id: 'ABC123ID',
        subaccount: 1234,
      }),
  },
  {
    name: 'updateApiKey (no subaccount)',
    actionCreator: () =>
      actions.updateApiKey({
        id: 'ABC123ID',
        grants: TEST_GRANTS,
        label: 'test label',
        validIps: ['1.1.1.1', '2.2.2.2'],
      }),
  },
  {
    name: 'updateApiKey (with subaccount)',
    actionCreator: () =>
      actions.updateApiKey({
        id: 'ABC123ID',
        grants: TEST_GRANTS,
        label: 'test label with subaccount',
        subaccount: 1234,
        validIps: ['1.1.1.1', '2.2.2.2'],
      }),
  },
  {
    name: 'hideNewApiKey',
    actionCreator: actions.hideNewApiKey,
  },
  {
    name: 'listSubaccountGrants',
    actionCreator: actions.listSubaccountGrants,
  },
]);
