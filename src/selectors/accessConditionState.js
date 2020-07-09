import { createSelector } from 'reselect';
import _ from 'lodash';
import { formatToMatchAccountPlan } from 'src/helpers/billing';

const getAccount = state => state.account;
const getUser = state => state.currentUser;
const getBundles = state => _.get(state, 'billing.bundles', []);
const getBundlePlans = state => _.get(state, 'billing.bundlePlans', []);
const getACReady = state => state.accessControlReady;
const getBillingSubscription = state => _.get(state, 'billing.subscription', {});

export const getCurrentAccountPlan = createSelector(
  [getAccount, getBundlePlans, getBundles, getBillingSubscription],
  (account, bundlePlans, bundles, subscription) => {
    return formatToMatchAccountPlan({
      ...bundlePlans.find(plan => plan.plan === account.subscription.code),
      ...bundles.find(bundle => bundle.bundle === account.subscription.code),
      products: subscription.products,
    });
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
