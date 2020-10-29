import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../accountSingleSignOn';

jest.mock('src/actions/helpers/sparkpostApiRequest');

snapshotActionCases('Action: Current User', {
  getAccountSingleSignOnDetails: {
    actionCreator: actions.getAccountSingleSignOnDetails,
  },
  provisionAccountSingleSignOn: {
    actionCreator: () => actions.provisionAccountSingleSignOn('abc=='),
  },
  reprovisionAccountSingleSignOn: {
    actionCreator: () => actions.reprovisionAccountSingleSignOn('abc=='),
  },
  updateAccountSingleSignOn: {
    actionCreator: () => {
      const args = {
        cert: 'abc==',
        enabled: true,
        provider: 'https://sso.sparkpost.com/redirect',
      };

      return actions.updateAccountSingleSignOn(args);
    },
  },
});
