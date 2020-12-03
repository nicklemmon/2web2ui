import React from 'react';
import { Box, Panel } from 'src/components/matchbox';
import PlanPrice from 'src/components/billing/PlanPrice';
import { PLAN_TIERS } from 'src/constants';
import { Warning } from '@sparkpost/matchbox-icons';

const CurrentPlanSection = ({ currentPlan, isPlanSelected }) => {
  return (
    <Panel>
      <Panel.Header>Current Plan</Panel.Header>

      <Panel.Section>
        <div>{PLAN_TIERS[currentPlan.tier]}</div>
        <div>
          <Box marginLeft="400" marginTop="400">
            <PlanPrice showOverage showIp showCsm plan={currentPlan} />
          </Box>
        </div>
      </Panel.Section>

      {isPlanSelected && currentPlan.status === 'deprecated' && (
        <Panel.Section>
          <div>
            <Warning size={28} />
            <div>
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
