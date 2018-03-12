import { createSelector } from 'reselect';
import _ from 'lodash';

const suspendedSelector = (state) => state.account.isSuspendedForBilling;
const pendingSubscriptionSelector = (state) => state.account.pending_subscription;
const plansSelector = (state) => state.billing.plans || [];
const accountBillingSelector = (state) => state.account.billing;

/**
 * Returns current subscription's code
 * @param state
 * @return plan code
 */
export const currentPlanCodeSelector = (state) => state.account.subscription.code;


/**
 * Returns true if user does not have pending plan change or is not suspended
 */
export const canChangePlanSelector = createSelector(
  [suspendedSelector, pendingSubscriptionSelector],
  (suspended, pendingSubscription) => !suspended && !pendingSubscription
);

/**
 * Get public plans from state and sorts them by volume
 */
export const publicPlansSelector = createSelector(
  [plansSelector],
  (plans) => _.sortBy(plans.filter((plan) => plan.status === 'public'), (plan) => plan.volume)
);

/**
 * Gets current plan
 */
export const currentPlanSelector = createSelector(
  [currentPlanCodeSelector, plansSelector],
  (currentPlanCode, plans) => _.find(plans, { code: currentPlanCode }) || {}
);

/**
 * Returns true if user has billing account and they are on a paid plan
 */
export const canUpdateBillingInfoSelector = createSelector(
  [currentPlanSelector, accountBillingSelector],
  (currentPlan, accountBilling) => !!accountBilling && !currentPlan.isFree
);

export const selectBillingInfo = createSelector(
  [
    canUpdateBillingInfoSelector,
    canChangePlanSelector,
    currentPlanSelector,
    publicPlansSelector
  ],
  (canUpdateBillingInfo, canChangePlan, currentPlan, plans) => ({
    canUpdateBillingInfo,
    canChangePlan,
    currentPlan,
    plans
  })
);
