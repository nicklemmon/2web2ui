import React from 'react';
import ConditionSwitch, { Case, defaultCase } from 'src/components/auth/ConditionSwitch';
import { AccessControl } from 'src/components/auth';
import { ExternalLink, PageLink } from 'src/components/links';
import { Text, Box, Button } from 'src/components/matchbox';
import { isAdmin } from 'src/helpers/conditions/user';
import { onPlanWithStatus } from 'src/helpers/conditions/account';
import { LINKS } from 'src/constants';
import useHibanaToggle from 'src/hooks/useHibanaToggle';

export const OGSendMoreCTA = ({ hasSendingLimits }) => (
  <AccessControl condition={isAdmin}>
    <p>
      Need to send more?{' '}
      <ConditionSwitch>
        {/* on a deprecated plan */}
        <Case
          condition={onPlanWithStatus('deprecated')}
          children={<PageLink to="/account/billing">Switch to a new plan.</PageLink>}
        />

        {/* regardless of self serve billing */}
        <Case
          condition={defaultCase}
          children={<PageLink to="/account/billing">Upgrade your account.</PageLink>}
        />
      </ConditionSwitch>{' '}
      {hasSendingLimits && (
        <ExternalLink to={LINKS.DAILY_MONTHLY_QUOTA_LIMIT_DOC}>
          Learn more about these limits.
        </ExternalLink>
      )}
    </p>
  </AccessControl>
);

export function HibanaSendMoreCTA({ hasSendingLimits }) {
  return (
    <AccessControl condition={isAdmin}>
      <Box display="flex" justifyContent="space-between" mt="200">
        <Box display="flex" alignItems="center">
          <Text mr="400">Need to send more?</Text>
          <ConditionSwitch>
            {/* on a deprecated plan */}
            <Case
              condition={onPlanWithStatus('deprecated')}
              children={
                <PageLink as={Button} variant="monochrome-secondary" to="/account/billing">
                  Switch to a new plan.
                </PageLink>
              }
            />

            {/* regardless of self serve billing */}
            <Case
              condition={defaultCase}
              children={
                <PageLink as={Button} variant="monochrome-secondary" to="/account/billing">
                  Upgrade your account.
                </PageLink>
              }
            />
          </ConditionSwitch>
        </Box>

        {hasSendingLimits ? (
          <Box display="flex" alignItems="center">
            <ExternalLink to={LINKS.DAILY_MONTHLY_QUOTA_LIMIT_DOC}>
              Learn more about these limits.
            </ExternalLink>
          </Box>
        ) : (
          <div />
        )}
      </Box>
    </AccessControl>
  );
}

const SendMoreCTA = props => {
  return useHibanaToggle(OGSendMoreCTA, HibanaSendMoreCTA)(props);
};
export default SendMoreCTA;
