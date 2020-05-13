import React, { createContext, useState, useCallback, useContext, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Button } from 'src/components/matchbox';
import { getSubscription } from 'src/actions/billing';
import { selectPlansByKey } from 'src/selectors/accountBillingInfo';
import { pluralString } from 'src/helpers/string';

const FeatureChangeContext = createContext({});

export const FeatureChangeProvider = ({
  children,
  plans,
  subscription,
  selectedBundle,
  loading,
  getSubscription,
}) => {
  const [actions, updateActions] = useState({});
  useEffect(() => {
    getSubscription();
  }, [getSubscription]);

  const checkConditions = useCallback(() => {
    getSubscription();
  }, [getSubscription]);
  useEffect(() => {
    window.addEventListener('focus', checkConditions);
    return () => {
      window.removeEventListener('focus', checkConditions);
    };
  }, [checkConditions]);

  //Keys the selected plan by product to make for easier comparison
  const selectedPlansByProduct = useMemo(() => {
    const { products } = selectedBundle;
    return products.reduce(
      (res, { product, plan: planId }) => ({
        ...res,
        [product]: plans[planId],
      }),
      {},
    );
  }, [plans, selectedBundle]);

  // console.log(selectedPlansByProduct);
  // Used for finding the features that need to have a proper function
  // Inserts into actions if it's got a conflicting issue
  // Updates if it was already in actions had conflicting issue
  const calculateDifferences = () => {
    if (!subscription) {
      return;
    }
    const { products: currentProducts } = subscription;
    const diffObject = currentProducts.reduce(
      (resObject, { product, quantity, limit: currentLimit }) => {
        const comparedPlan = selectedPlansByProduct[product];
        switch (product) {
          case 'dedicated_ip':
            if (actions.dedicated_ip || !comparedPlan) {
              resObject[product] = {
                label: 'Dedicated IPs',
                description: (
                  <div>
                    <span>
                      {`Your new plan doesn't include dedicated IPs. 
                    Your current IP(s) will be removed at the end of your current billing cycle.`}
                    </span>
                  </div>
                ),
                condition: true,
              };
            }
            return resObject;
          case 'subaccounts':
            //there will always be a limit present for each plan,
            //but till the api is released we need to default the higher limit to keep the current flow working
            const limit = _.get(comparedPlan, 'limit', 5000);
            const qtyExceedsLimit = Boolean(quantity > limit);
            const isLimitDecreasing = currentLimit > limit;
            if (actions.subaccounts || qtyExceedsLimit || isLimitDecreasing) {
              resObject.subaccounts = {
                label: 'Subaccounts',
                description: (
                  <div>
                    {limit === 0
                      ? "Your new plan doesn't include subaccounts."
                      : `Your new plan only allows for ${pluralString(
                          limit,
                          'active subaccount',
                          'active subaccounts',
                        )}.`}
                    {qtyExceedsLimit && (
                      <>
                        <span> Please </span>
                        <strong>
                          change the status to terminated for{' '}
                          {pluralString(quantity - limit, 'subaccount', 'subaccounts')}
                        </strong>
                        <span> to continue.</span>
                      </>
                    )}
                  </div>
                ),
                condition: !qtyExceedsLimit,
                action: qtyExceedsLimit ? (
                  <Button variant="destructive" external to="/account/subaccounts">
                    Update Status
                  </Button>
                ) : (
                  undefined
                ),
              };
            }
            return resObject;
          case 'sso':
          case 'tfa_required':
            if (actions.auth || !comparedPlan) {
              resObject.auth = {
                label: 'Authentication and Security',
                description:
                  'Your new plan no longer allows for single sign-on and account-wide requirement of two-factor authentication.',
                condition: true,
              };
            }
            return resObject;
          case 'messaging':
          default:
            return resObject;
        }
      },
      {},
    );
    updateActions({ ...actions, ...diffObject });
  };

  useMemo(calculateDifferences, [subscription]);
  const mappedFeatures = useMemo(
    () =>
      _.map(actions, (action, key) => ({
        ...action,
        key,
      })),
    [actions],
  );

  const value = {
    isReady: _.every(mappedFeatures, 'condition'),
    features: mappedFeatures,
    loading,
  };

  return <FeatureChangeContext.Provider value={value}>{children}</FeatureChangeContext.Provider>;
};

const mapStateToProps = state => ({
  plans: selectPlansByKey(state),
  subscription: state.billing.subscription,
  loading: state.billing.loading,
});

export const FeatureChangeContextProvider = connect(mapStateToProps, { getSubscription })(
  FeatureChangeProvider,
);

export const useFeatureChangeContext = () => useContext(FeatureChangeContext);

export default FeatureChangeContext;
