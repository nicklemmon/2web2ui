/* eslint-disable lodash/prefer-immutable-method */
import { createSelector } from 'reselect';
import _ from 'lodash';
import {
  isAws,
  isCustomBilling,
  isSelfServeBilling,
  onPlan,
  onZuoraPlan,
  hasProductOnSubscription,
} from 'src/helpers/conditions/account';
import { selectCondition } from './accessConditionState';
import { getCurrentAccountPlan } from 'src/selectors/accessConditionState';
const suspendedSelector = state => state.account.isSuspendedForBilling;
const pendingSubscriptionSelector = state =>
  state.account.pending_subscription ||
  _.get(state, 'billing.subscription.pending_downgrades', []).length > 0;
const plansSelector = state => state.billing.bundlePlans || [];
const bundleSelector = state => state.billing.bundles || [];
const bundlePlanSelector = state => state.billing.bundlePlans || [];
const accountBillingSelector = state => state.account.billing;
const accountBilling = state => state.billing;
const selectIsAws = selectCondition(isAws);
const selectIsCustomBilling = selectCondition(isCustomBilling);
export const selectIsSelfServeBilling = selectCondition(isSelfServeBilling);
const selectIsCcFree1 = selectCondition(onPlan('ccfree1'));
const selectIsFree1 = selectCondition(onPlan('free1'));
const selectOnZuoraPlan = selectCondition(onZuoraPlan);
const hasDedicatedIpsOnSubscription = selectCondition(hasProductOnSubscription('dedicated_ip'));
const selectOnlineSupportOnSubscription = selectCondition(
  hasProductOnSubscription('online_support'),
);
const selectPhoneSupportOnSubscription = selectCondition(hasProductOnSubscription('phone_support'));
const selectBillingSubscription = state => state.billing.subscription || {};
const currentFreePlans = ['free500-1018', 'free15K-1018', 'free500-0419', 'free500-SPCEU-0419'];
export const isManuallyBilled = state => _.get(state, 'billing.subscription.type') === 'manual';
const getRecipientValidationUsage = state => _.get(state, 'account.rvUsage.recipient_validation');
export const currentSubscriptionSelector = state => state.account.subscription;
export const hasPhoneSupport = createSelector(
  [selectPhoneSupportOnSubscription],
  hasPhoneSupport => hasPhoneSupport,
);
export const hasOnlineSupport = createSelector(
  [selectOnlineSupportOnSubscription],
  hasOnlineSupport => hasOnlineSupport,
);
/**
 * Returns current subscription's code
 * @param state
 * @return plan code
 */
export const currentPlanCodeSelector = createSelector(
  [currentSubscriptionSelector],
  (subscription = {}) => subscription.code,
);

/**
 * Returns true if user does not have pending plan change or is not suspended
 */
export const canChangePlanSelector = createSelector(
  [suspendedSelector, pendingSubscriptionSelector, selectIsCustomBilling],
  (suspended, pendingSubscription, customBilling) =>
    !suspended && !pendingSubscription && !customBilling,
);

/**
 * Returns true if user has billing account and they are on a paid plan
 */
export const canUpdateBillingInfoSelector = createSelector(
  [getCurrentAccountPlan, accountBillingSelector, selectIsCcFree1],
  (currentPlan, accountBilling, isOnLegacyCcFreePlan) => {
    return accountBilling && (isOnLegacyCcFreePlan || !currentPlan.isFree);
  },
);
/*
return the promoCode related information from billing
*/
export const getPromoCodeObject = createSelector([accountBilling], billing => ({
  promoError: billing.promoError,
  promoPending: billing.promoPending,
  selectedPromo: billing.selectedPromo,
}));

export const selectAvailablePlans = createSelector(
  [plansSelector, selectIsAws, selectIsSelfServeBilling],
  (plans, isAws, isSelfServeBilling) => {
    const availablePlans = plans
      // only select AWS plans for AWS users
      .filter(({ awsMarketplace = false }) => awsMarketplace === isAws);

    if (!isSelfServeBilling) {
      _.remove(availablePlans, ({ isFree = false }) => isFree);
    }

    return availablePlans;
  },
);

export const selectVisiblePlans = createSelector(
  [selectAvailablePlans, selectIsFree1, currentPlanCodeSelector],
  (plans, isOnLegacyFree1Plan) =>
    plans.filter(
      ({ isFree, status }) => status === 'public' && !(isOnLegacyFree1Plan && isFree), //hide new free plans if on legacy free1 plan
    ),
);

export const selectAvailableBundles = createSelector(
  [bundleSelector, bundlePlanSelector, selectIsSelfServeBilling],
  (bundles, plans, isSelfServeBilling) => {
    if (!plans.length) {
      return []; //Waits for data to be ready to join
    }
    const availableBundles = bundles;
    if (!isSelfServeBilling) {
      _.remove(availableBundles, ({ isFree = false }) => isFree);
    }

    const plansByKey = _.keyBy(plans, 'plan');
    const bundlesWithPlans = _.map(availableBundles, bundle => {
      const messaging = plansByKey[bundle.bundle];
      return { ...bundle, messaging };
    });
    return bundlesWithPlans;
  },
);

export const currentBundleSelector = createSelector(
  [currentPlanCodeSelector, selectAvailableBundles],
  (currentPlanCode, bundles) => _.find(bundles, { bundle: currentPlanCode }) || {},
);

/**
 * Return true if plan can purchase IP and has billing info (except for aws as it'll be billed outside)
 */
export const canPurchaseIps = createSelector(
  [accountBillingSelector, selectIsAws, hasDedicatedIpsOnSubscription],
  (accountBilling, isAWSAccount, hasDedicatedIpsOnSubscription) => {
    return hasDedicatedIpsOnSubscription && !!(accountBilling || isAWSAccount);
  },
);

export const selectVisibleBundles = createSelector(
  [selectAvailableBundles, selectIsFree1, currentPlanCodeSelector],
  (bundles, isOnLegacyFree1Plan) =>
    bundles.filter(
      ({ isFree, status }) => status === 'public' && !(isOnLegacyFree1Plan && isFree), //hide new free plans if on legacy free1 plan
    ),
);

export const selectTieredVisibleBundles = createSelector([selectVisibleBundles], bundles => {
  const normalizedPlans = bundles.map(bundle => ({
    ...bundle,
    tier: bundle.tier || (currentFreePlans.includes(bundle.code) ? 'test' : 'default'),
  }));

  return _.groupBy(normalizedPlans, 'tier');
});

export const selectPlansByKey = createSelector([bundlePlanSelector], plans =>
  _.keyBy(plans, 'plan'),
);

export const selectAccount = state => state.account;

export const selectAccountBilling = createSelector([selectAccount], account => ({
  account,
  error: account.error || account.billingError,
  loading: account.loading || account.billingLoading || account.usageLoading,
}));

export const getBundleTierByPlanCode = createSelector(
  [bundleSelector, currentSubscriptionSelector],
  (bundles, currentSubscription) => {
    const bundle = _.find(bundles, { bundle: currentSubscription.code }) || {}; //added {} for deprecated plans
    return bundle.tier || '';
  },
);

export const selectBillingInfo = createSelector(
  [
    canUpdateBillingInfoSelector,
    canChangePlanSelector,
    canPurchaseIps,
    getCurrentAccountPlan,
    selectOnZuoraPlan,
    selectVisiblePlans,
    selectIsAws,
    selectBillingSubscription,
  ],
  (
    canUpdateBillingInfo,
    canChangePlan,
    canPurchaseIps,
    currentPlan,
    onZuoraPlan,
    plans,
    isAWSAccount,
    subscription,
  ) => {
    return {
      canUpdateBillingInfo,
      canChangePlan,
      canPurchaseIps,
      currentPlan,
      onZuoraPlan,
      plans,
      isAWSAccount,
      subscription,
    };
  },
);

export const selectMonthlyRecipientValidationUsage = createSelector(
  getRecipientValidationUsage,
  usage => _.get(usage, 'month.used', 0),
);
