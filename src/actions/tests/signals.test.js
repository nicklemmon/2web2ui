import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../signals';
jest.mock('src/actions/helpers/sparkpostApiRequest');
jest.mock('src/helpers/date', () => ({
  formatInputDate: d => d,
}));

describe('Signals Actions', () => {
  const requiredOptions = {
    from: '2018-01-12',
    to: '2018-01-13',
  };

  snapshotActionCases('.getSpamHits', {
    'by default': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions }),
    },
    'with a facet': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions, facet: 'sending-domain' }),
    },
    'with a subaccount facet': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions, facet: 'sid', filter: 123 }),
    },
    'with a filter': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions, filter: 'examp' }),
    },
    'with a limit': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions, limit: 100 }),
    },
    'with a offset': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions, offset: 9 }),
    },
    'with an order': {
      actionCreator: () =>
        actions.getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'example_field' }),
    },
    'with a order by subaccount': {
      actionCreator: () =>
        actions.getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'sid' }),
    },
    'with a order field that needs to be mapped': {
      actionCreator: () =>
        actions.getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'current_trap_hits' }),
    },
    'with a subaccount': {
      actionCreator: () => actions.getSpamHits({ ...requiredOptions, subaccount: { id: 123 } }),
    },
  });

  snapshotActionCases('.getEngagementRecency', {
    'by default': {
      actionCreator: () => actions.getEngagementRecency({ ...requiredOptions }),
    },
  });

  snapshotActionCases('.getEngagementRateByCohort', {
    'by default': {
      actionCreator: () => actions.getEngagementRateByCohort({ ...requiredOptions }),
    },
  });

  snapshotActionCases('.getUnsubscribeRateByCohort', {
    'by default': {
      actionCreator: () => actions.getUnsubscribeRateByCohort({ ...requiredOptions }),
    },
  });

  snapshotActionCases('.getComplaintsByCohort', {
    'by default': {
      actionCreator: () => actions.getComplaintsByCohort({ ...requiredOptions }),
    },
  });

  snapshotActionCases('.getHealthScore', {
    'by default': {
      actionCreator: () => actions.getHealthScore({ ...requiredOptions }),
    },
    'with an order by subaccount': {
      actionCreator: () =>
        actions.getHealthScore({ ...requiredOptions, order: 'asc', orderBy: 'sid' }),
    },
    'with a mailbox provider filter': {
      actionCreator: () =>
        actions.getHealthScore({ ...requiredOptions, facet: 'mb_provider', filter: 'Google Ap' }),
    },
  });

  snapshotActionCases('.getCurrentHealthScore', {
    'by default': {
      actionCreator: () => actions.getCurrentHealthScore({ ...requiredOptions }),
    },
  });
});
