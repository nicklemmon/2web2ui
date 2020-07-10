import React from 'react';
import _ from 'lodash';
import { formatCurrency } from 'src/helpers/units';
import cx from 'classnames';
import { Text } from 'src/components/matchbox';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import OGStyles from './PlanPrice.module.scss';
import HibanaStyles from './PlanPriceHibana.module.scss';

const PlanPrice = ({
  plan,
  showOverage = false,
  showIp = false,
  showCsm = false,
  selectedPromo = {},
  className,
}) => {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  if (_.isEmpty(plan)) {
    return null;
  }

  const overage =
    plan.price <= 0 || plan.isFree
      ? 'Full-featured developer account'
      : plan.overage
      ? `$${plan.overage.toFixed(2)}/ thousand extra emails. `
      : null;

  const ip = plan.includesIp ? 'First dedicated IP address is free' : null;

  const displayCsm = showCsm && plan.includesCsm;

  let discountAmount = plan.price;

  if (selectedPromo.discount_amount) {
    discountAmount = Math.max(plan.price - selectedPromo.discount_amount, 0);
  }

  if (selectedPromo.discount_percentage) {
    discountAmount = discountAmount * ((100 - selectedPromo.discount_percentage) / 100);
  }

  const hasDiscount = discountAmount !== plan.price;

  return (
    <span className={cx('notranslate', className)}>
      <span className={styles.MainLabel}>
        <strong>
          <Text as="span" fontWeight="400">
            {plan.volume.toLocaleString()}
          </Text>
        </strong>
        <span> emails/month </span>
        {plan.price > 0 ? (
          <span>
            {' at '}
            {hasDiscount && <s className={styles.DiscountedLabel}>${plan.price}</s>}
            <strong>{hasDiscount ? formatCurrency(discountAmount) : `$${plan.price}`}</strong>/mo
          </span>
        ) : (
          <span> FREE </span>
        )}
      </span>
      <span className={styles.SupportLabel}>
        {showOverage && overage}
        {showIp && ip}
      </span>
      {displayCsm && (
        <span className={styles.SupportLabel}>Customer Success Manager included.</span>
      )}
    </span>
  );
};

export default PlanPrice;
