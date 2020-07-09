import React from 'react';
import { Box, Panel } from 'src/components/matchbox';
import PlanPrice from 'src/components/billing/PlanPrice';
import OGStyles from './CurrentPlanSection.module.scss';
import HibanaStyles from './CurrentPlanSectionHibana.module.scss';
import { PLAN_TIERS } from 'src/constants';
import { Warning } from '@sparkpost/matchbox-icons';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

const CurrentPlanSection = ({ currentPlan, isPlanSelected }) => {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  return (
    <Panel title="Current Plan">
      <Panel.Section className={styles.currentPlan}>
        <div className={styles.Title}>{PLAN_TIERS[currentPlan.tier]}</div>
        <div className={styles.Plan}>
          <Box marginLeft="400" marginTop="400">
            <PlanPrice showOverage showIp showCsm plan={currentPlan} />
          </Box>
        </div>
      </Panel.Section>
      {isPlanSelected && currentPlan.status === 'deprecated' && (
        <Panel.Section>
          <div className={styles.DeprecatedWarning}>
            <Warning size={28} />
            <div className={styles.content}>
              <span>Your current plan is no longer available. Once you switch back, </span>
              <strong>you won't be able to change back.</strong>
            </div>
          </div>
        </Panel.Section>
      )}
    </Panel>
  );
};

export default CurrentPlanSection;
