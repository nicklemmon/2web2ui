import { createSelector } from 'reselect';
import _ from 'lodash';
import { isAws, isSelfServeBilling, onPlan } from 'src/helpers/conditions/account';

const suspendedSelector = (state) => state.account.isSuspendedForBilling;
const pendingSubscriptionSelector = (state) => state.account.pending_subscription;
const plansSelector = (state) => state.billing.plans || [];
const accountBillingSelector = (state) => state.account.billing;
const isFreeLegacyPlanSelector = (state) => onPlan('ccfree1')(state);
const isFreeLegacyFree1PlanSelector = (state) => onPlan('free1')(state);

export const currentSubscriptionSelector = (state) => state.account.subscription;

/**
 * Returns current subscription's code
 * @param state
 * @return plan code
 */
export const currentPlanCodeSelector = createSelector(
  [currentSubscriptionSelector],
  (subscription = {}) => subscription.code
);

/**
 * Returns true if user does not have pending plan change or is not suspended
 */
export const canChangePlanSelector = createSelector(
  [suspendedSelector, pendingSubscriptionSelector],
  (suspended, pendingSubscription) => !suspended && !pendingSubscription
);

/**
 * Gets current plan
 */
export const currentPlanSelector = createSelector(
  [currentPlanCodeSelector, plansSelector],
  (currentPlanCode, plans) => _.find(plans, { code: currentPlanCode }) || {}
);

export const isAWSAccountSelector = createSelector(
  [currentSubscriptionSelector],
  (currentSubscription) => currentSubscription.type === 'aws'
);

/**
 * Returns true if user has billing account and they are on a paid plan
 */
export const canUpdateBillingInfoSelector = createSelector(
  [currentPlanSelector, accountBillingSelector, isFreeLegacyPlanSelector],
  (currentPlan, accountBilling, isFreeLegacyPlan) => (
    accountBilling && (isFreeLegacyPlan || !currentPlan.isFree)
  )
);

/**
 * Return true if plan can purchase IP and has billing info (except for aws as it'll be billed outside)
 */
export const canPurchaseIps = createSelector(
  [currentPlanSelector, accountBillingSelector, isAWSAccountSelector],
  (currentPlan, accountBilling, isAWSAccount) => currentPlan.canPurchaseIps === true && !!(accountBilling || isAWSAccount)
);

export const selectAvailablePlans = createSelector(
  [plansSelector, isAws, isSelfServeBilling],
  (plans, isAws, isSelfServeBilling) => {
    const availablePlans = plans
      .filter(({ status }) => status === 'public' || status === 'secret')
      // only select AWS plans for AWS users
      .filter(({ awsMarketplace = false }) => awsMarketplace === isAws);

    if (!isSelfServeBilling) {
      _.remove(availablePlans, ({ isFree = false }) => isFree);
    }

    return _.orderBy(availablePlans, 'volume', isSelfServeBilling ? 'asc' : 'desc');
  }
);

export const selectVisiblePlans = createSelector(
  [selectAvailablePlans, isFreeLegacyFree1PlanSelector],
  (plans, isLegacyFree1) => plans.filter(({ isFree, status }) =>
    status === 'public' &&
        !(isLegacyFree1 && isFree) //hide new free plans if on free1 plan
  )
);

export const selectBillingInfo = createSelector(
  [
    canUpdateBillingInfoSelector,
    canChangePlanSelector,
    canPurchaseIps,
    currentPlanSelector,
    selectVisiblePlans,
    isAWSAccountSelector
  ],
  (canUpdateBillingInfo, canChangePlan, canPurchaseIps, currentPlan, plans, isAWSAccount) => ({
    canUpdateBillingInfo,
    canChangePlan,
    canPurchaseIps,
    currentPlan,
    plans,
    isAWSAccount
  })
);
