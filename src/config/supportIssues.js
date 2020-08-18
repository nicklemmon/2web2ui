import _ from 'lodash';
import {
  hasStatus,
  hasStatusReasonCategory,
  isSuspendedForBilling,
  onPlanWithStatus,
  isSelfServeBilling,
  hasProductOnSubscription,
} from 'src/helpers/conditions/account';
import { isEmailVerified } from 'src/helpers/conditions/user';
import { all, not, any } from 'src/helpers/conditions';
import { isAws } from 'src/helpers/conditions/account';
import { isAdmin } from 'src/helpers/conditions/user';

// types of support issues
// @note these values are used by our BizOps team in Salesforce Service Cloud to assign
//   a specific ticket workflow, changes need to be coordinated with BizOps
const BILLING = 'Billing';
const COMPLIANCE = 'Compliance';
const ERRORS = 'Errors';
const LIMITS = 'DailyLimits';
const SUPPORT = 'Support';

const defaultMessageLabel = 'Tell us more about your issue';
const defaultCondition = all(hasProductOnSubscription('online_support'), hasStatus('active'));

/**
 * @example
 *   {
 *     // a snake cased string, used to reference a specific issue
 *     // @note only used by our application
 *     id: 'example_issue',
 *
 *     // the label for the support form dropdown
 *     // @note these values are used as a subject line in Salesforce Service Cloud, changes do not
 *     //   need to be coordinated with BizOps because it is a free text field
 *     label: 'This is an example',
 *
 *     // the follow-up question for the support form (optional; to override default)
 *     messageLabel: 'Tell us more about your issue',
 *
 *     // the issue category
 *     // @note these values are used by our BizOps team in Salesforce Service Cloud to assign
 *     //   a specific ticket workflow, changes need to be coordinated with BizOps
 *     type: 'Example',
 *   }
 */
const supportIssues = [
  {
    id: 'ui_errors',
    label: 'UI errors',
    type: ERRORS,
  },
  {
    id: 'signals_issues',
    label: 'Signals issues',
    type: SUPPORT,
  },
  {
    id: 'sending_domain_block',
    label: 'Sending domain block',
    type: COMPLIANCE,
  },
  {
    id: 'configuration_setup_support',
    label: 'Configuration support',
    type: SUPPORT,
  },
  {
    id: 'dns',
    label: 'DNS help',
    type: SUPPORT,
  },
  {
    id: 'placement_deliverability',
    label: 'Deliverability issues',
    type: SUPPORT,
  },
  {
    id: 'reporting_and_event_issues',
    label: 'Reporting & event issues',
    type: SUPPORT,
  },
  {
    id: 'blocklisting',
    label: 'IP blocklisting',
    type: COMPLIANCE,
  },
  {
    id: 'product/support_feedback',
    label: 'Feedback',
    type: SUPPORT,
  },
  {
    id: 'account_upgrade/downgrade_issue',
    label: 'Account upgrade/downgrade issues',
    type: SUPPORT,
    condition: isAdmin,
  },
  {
    id: 'request_new_ip',
    label: 'Request new IP',
    type: SUPPORT,
    condition: all(isAdmin, not(isSelfServeBilling)),
  },
  {
    id: 'general_billing',
    label: 'Billing problems',
    messageLabel: 'Tell us more about your billing issue',
    type: BILLING,
    condition: all(isAdmin, any(isSuspendedForBilling, hasStatus('active'))),
  },
  {
    id: 'account_suspension',
    label: 'Account suspension',
    messageLabel: 'Why do you think your account should be unsuspended?',
    type: COMPLIANCE,
    condition: all(isAdmin, hasStatus('suspended'), not(hasStatusReasonCategory('100.01'))),
  },
  {
    id: 'daily_limits',
    label: 'Daily sending limit increase',
    messageLabel: 'What limit do you need and why?',
    type: LIMITS,
    condition: all(
      hasProductOnSubscription('online_support'),
      isAdmin,
      isEmailVerified,
      hasStatus('active'),
      not(onPlanWithStatus('deprecated')),
    ),
  },
  {
    id: 'account_cancellation',
    label: 'Account cancellation',
    messageLabel: 'Tell us why you are leaving',
    type: BILLING,
    condition: isAdmin,
  },
  {
    id: 'general_issue',
    label: 'Another issue',
    messageLabel: 'Tell us more about your issue',
    type: SUPPORT,
    condition: any(defaultCondition, isAws),
  },
];

const augmentIssuesList = function() {
  return _.map(supportIssues, supportIssue => ({
    ...supportIssue,
    messageLabel: supportIssue.messageLabel || defaultMessageLabel,
    condition: supportIssue.condition || defaultCondition,
  }));
};

export default augmentIssuesList();
