import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../subaccounts';

jest.mock('../helpers/sparkpostApiRequest');

snapshotActionCases('Action: Subaccounts', {
  clearSubaccount: {
    actionCreator: actions.clearSubaccount,
  },
  editSubaccount: {
    actionCreator: () => actions.editSubaccount(123, { name: 'Test Example' }),
  },
  getSubaccount: {
    actionCreator: () => actions.getSubaccount(123),
  },
  list: {
    actionCreator: actions.list,
  },
});
