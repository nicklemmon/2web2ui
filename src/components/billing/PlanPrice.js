import React from 'react';
import { Eco } from '@sparkpost/matchbox-icons';
import _ from 'lodash';
import { formatCurrency } from 'src/helpers/units';
import cx from 'classnames';
import { Box, Stack, Tag, Text, Tooltip } from 'src/components/matchbox';
import { Bold, TranslatableText } from 'src/components/text';

const PlanPrice = ({
  plan,
  showOverage = false,
  showIp = false,
  showCsm = false,
  selectedPromo = {},
  isCurrentPlan,
  className,
}) => {
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
  const { plan: planCode } = plan;
  const isGreen = planCode.includes('green');

  return (
    <Stack className={cx('notranslate', className)} space="200">
      <Stack space="100">
        <Box
          fontWeight={isCurrentPlan ? 'semibold' : 'normal'}
          color={isCurrentPlan ? 'blue.700' : 'gray.900'}
        >
          <Text as="span">{plan.volume.toLocaleString()}</Text>
          <span> emails/month </span>
          {plan.price > 0 ? (
            <span>
              {' at '}
              {hasDiscount && <s>${plan.price}</s>}
              <Bold>{hasDiscount ? formatCurrency(discountAmount) : `$${plan.price}`}</Bold>/mo
            </span>
          ) : (
            <span> FREE </span>
          )}
        </Box>

        <Text color="gray.700">
          {showOverage && overage}
          {showIp && ip}
        </Text>
      </Stack>

      {isGreen ? (
        <Tooltip
          id={`tooltip-${planCode}`}
          content="Automatically purchase carbon offsets for every email sent."
        >
          <Tag color="green">
            <div>
              <Box as={Eco} marginTop="-5px" />
              <TranslatableText>&nbsp;Green</TranslatableText>
            </div>
          </Tag>
        </Tooltip>
      ) : null}

      {displayCsm && <span>Customer Success Manager included.</span>}
    </Stack>
  );
};

export default PlanPrice;
