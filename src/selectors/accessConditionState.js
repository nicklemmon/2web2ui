import { createSelector } from 'reselect';
import _ from 'lodash';

const getAccount = state => state.account;
const getUser = state => state.currentUser;
const getBundles = state => _.get(state, 'billing.bundles', []);
const getBundlePlans = state => _.get(state, 'billing.bundlePlans', []);
const getACReady = state => state.accessControlReady;
const getBillingSubscription = state => _.get(state, 'billing.subscription', {});
const currentFreePlans = ['free500-1018', 'free15K-1018', 'free500-0419', 'free500-SPCEU-0419'];
export const getCurrentAccountPlan = createSelector(
  [getAccount, getBundlePlans, getBundles, getBillingSubscription],
  (account, bundlePlans, bundles, subscription) => {
    const currentMessagingPlanDetails =
      bundlePlans.find(plan => plan.plan === account.subscription.code) || {};
    const currentBundle = bundles.find(bundle => bundle.bundle === account.subscription.code) || {};
    const currentPlan = {
      ...currentMessagingPlanDetails,
      ...currentBundle,
      products: subscription.products || [],
    };
    return {
      billingId: currentPlan.billing_id,
      code: currentPlan.plan,
      includesIp:
        Boolean(currentPlan.status) &&
        !_.isEmpty(_.find(currentBundle.products, { product: 'dedicated_ip' })), //second condition added for starter plans,
      isFree: currentFreePlans.includes(currentPlan.plan),
      status: !currentPlan.status ? 'deprecated' : currentPlan.status, //since bundlePlans don't return deprecated plans;
      ...currentPlan,
    };
  },
);

const selectAccessConditionState = createSelector(
  [getAccount, getUser, getBundlePlans, getCurrentAccountPlan, getACReady],
  (account, currentUser, plans, accountPlan, ready) => {
    return {
      account,
      currentUser,
      plans,
      accountPlan,
      ready,
    };
  },
);

export default selectAccessConditionState;

/**
 * Use this helper to "wrap" a condition helper and turn it into a "regular selector"
 *
 * Condition helpers expect a very specific state, so using condition helpers directly
 * in mapStateToProps or in other selectors doesn't work. But by using this wrapper,
 * the condition helper will be given the correct state to accurately return its boolean value.
 */

export const selectCondition = condition => createSelector([selectAccessConditionState], condition);
