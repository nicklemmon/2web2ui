import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';

// https://github.com/facebook/jest/issues/2582#issuecomment-346886018
// TODO: Finish the tests for tracking domains actions
describe.skip('Action Creator: Tracking Domains ', () => {
  describe('non-chained dispatches', () => {
    jest.mock('../helpers/sparkpostApiRequest', a => a);
    const trackingDomains = require('../trackingDomains');

    snapshotActionCases('Action Creator: Sending Domains', {
      'listTrackingDomains description': {
        actionCreator: () => trackingDomains.listTrackingDomains({}),
      },
      'verifyTrackingDomains description': {
        actionCreator: () => trackingDomains.verifyTrackingDomains({}),
      },
    });
  });

  describe('chained dispatches', () => {
    jest.mock('../helpers/sparkpostApiRequest', a => a);

    jest.mock('../globalAlert', () => {
      return {
        showAlert: jest.fn(a => a),
      };
    });

    const trackingDomains = require('../trackingDomains');

    snapshotActionCases('Action Creator: Sending Domains', {
      'createTrackingDomain description': {
        actionCreator: () => trackingDomains.createTrackingDomain({}),
      },
      'updateTrackingDomain description': {
        actionCreator: () => trackingDomains.updateTrackingDomain({}),
      },
      'deleteTrackingDomain description': {
        actionCreator: () => trackingDomains.deleteTrackingDomain({}),
      },
    });
  });
});
