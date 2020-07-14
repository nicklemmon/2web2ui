import * as selectors from '../support';

jest.mock('src/config/supportIssues', () => [
  { id: 'without_condition' },
  { id: 'when_satisfied', condition: jest.fn(() => true) },
  { id: 'when_not_satisfied', condition: jest.fn(() => false) },
]);

jest.mock('src/selectors/accessConditionState', () => jest.fn(s => s));

describe('Selectors: support', () => {
  describe('currentLimitSelector', () => {
    let account;
    let state;

    beforeEach(() => {
      account = {
        usage: {
          day: {
            limit: 1000,
          },
        },
      };

      state = {
        account,
      };
    });

    it('returns correct limit', () => {
      expect(selectors.currentLimitSelector(state)).toEqual(1000);
    });

    it('returns default value (0) for when limit does not exist', () => {
      delete account.usage.day.limit;
      expect(selectors.currentLimitSelector(state)).toEqual(0);
    });
  });

  describe('selectSupportIssues', () => {
    it('should return issues that satisfied condition', () => {
      const state = { account: { id: 'stubbed_for_snapshot' } };
      expect(selectors.selectSupportIssues(state)).toMatchSnapshot();
    });
  });

  describe('selectSupportIssue', () => {
    const state = {}; // conditions are stubbed

    it('should return issue ', () => {
      const id = 'without_condition';
      expect(selectors.selectSupportIssue(state, id)).toEqual({ id });
    });

    it('should return undefined for not satisified issue', () => {
      expect(selectors.selectSupportIssue(state, 'when_not_satisfied')).toBeUndefined();
    });

    it('should return undefined for unknown issue', () => {
      expect(selectors.selectSupportIssue(state, 'unknown_issue')).toBeUndefined();
    });
  });

  describe('authorizedToSubmitSupportTickets', () => {
    const issues = ['issue1', 'issue2'];
    const accessControlState = {
      currentUser: {
        grants: [{ key: 'support/manage' }],
      },
    };

    // selector.resultFunc: https://github.com/reduxjs/reselect#q-how-do-i-test-a-selector
    const subject = ({ issues, accessControlState }) =>
      selectors.authorizedToSubmitSupportTickets.resultFunc(issues, accessControlState);

    it('should allow users who are allowed to submit >0 ticket types and have the grant', () => {
      expect(subject({ issues, accessControlState })).toBeTruthy();
    });

    it('should block users without the correct grant', () => {
      const emptyState = { currentUser: { grants: [{ key: 'robot/dance' }] } };
      expect(subject({ issues, accessControlState: emptyState })).toBeFalsy();
    });

    it('should block users who cannot submit any ticekt type', () => {
      expect(subject({ issues: [], accessControlState })).toBeFalsy();
    });
  });

  describe('notAuthorizedToSubmitSupportTickets', () => {
    it('should negate the result of its positive counterpart', () => {
      expect(selectors.notAuthorizedToSubmitSupportTickets.resultFunc(true)).toBeFalsy();
      expect(selectors.notAuthorizedToSubmitSupportTickets.resultFunc(false)).toBeTruthy();
    });
  });
});
