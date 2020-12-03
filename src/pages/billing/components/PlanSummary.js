import React from 'react';
import { Eco } from '@sparkpost/matchbox-icons';
import { Heading, TranslatableText } from 'src/components/text';
import { Tooltip, Tag, Box, Stack } from 'src/components/matchbox';
import { formatDate } from 'src/helpers/date';
import styles from './PlanSummary.module.scss';
const PlanSummary = ({ plan, pendingCancellation = {} }) => {
  const {
    code,
    period,
    plan_volume: planVolume,
    plan_volume_per_period: planVolumePerPeriod,
    overage,
    recurring_charge: recurringCharge,
  } = plan;
  const isGreen = code.includes('green');
  const cost =
    recurringCharge === 0
      ? 'free'
      : `$${recurringCharge.toLocaleString()} per ${period || 'month'}`;
  const volume = (planVolumePerPeriod || planVolume).toLocaleString();
  const { effective_date } = pendingCancellation;

  return (
    <Stack space="100">
      <Heading as="h6" className={styles.Headline} looksLike="h5">
        {volume} emails for {cost}
        {effective_date && (
          <small> to end {formatDate(effective_date)} when your account will be cancelled</small>
        )}
      </Heading>
      {overage && <p>${overage.toFixed(2)} per thousand extra emails</p>}

      {isGreen ? (
        <div>
          <Tooltip id="tooltip-green-plan" content="Carbon offsets purchased for every email sent.">
            <Tag color="green">
              <div>
                <Box as={Eco} marginTop="-5px" />
                <TranslatableText>&nbsp;Green</TranslatableText>
              </div>
            </Tag>
          </Tooltip>
        </div>
      ) : null}
    </Stack>
  );
};

export default PlanSummary;
