import React from 'react';
import qs from 'qs';
import { useLocation } from 'react-router-dom';
import { Eco } from '@sparkpost/matchbox-icons';
import { Heading, TranslatableText } from 'src/components/text';
import { Tooltip, Tag, Box, Stack } from 'src/components/matchbox';
import { formatDate } from 'src/helpers/date';
import styles from './PlanSummary.module.scss';

// eslint-disable-next-line
const FAKE_GREEN_SUBSCRIPTION = {
  code: '100K-premier-0519-green',
  name: '100K Premier',
  overage: 0.85,
  period: 'month',
  plan_volume: 100000,
  recurring_charge: 76.35,
  type: 'default',
  self_serve: true,
  plan_volume_per_period: 100000,
};

const PlanSummary = ({ plan, pendingCancellation = {} }) => {
  const { search } = useLocation();
  const { green_plan } = qs.parse(search.slice(1));
  const currentPlan = green_plan ? FAKE_GREEN_SUBSCRIPTION : plan;
  const {
    code,
    period,
    plan_volume: planVolume,
    plan_volume_per_period: planVolumePerPeriod,
    overage,
    recurring_charge: recurringCharge,
  } = currentPlan;
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
