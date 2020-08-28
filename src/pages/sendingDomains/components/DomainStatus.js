import React from 'react';

import { Banner, Panel } from 'src/components/matchbox';
import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';

import VerificationHelp from './VerificationHelp';
import StatusDescription from './StatusDescription';
import ShareWithSubaccounts from './ShareWithSubaccounts';
import { SendingDomainSection } from './SendingDomainSection';

export const DomainStatus = ({ domain, hasAutoVerifyEnabled, onShareDomainChange }) => {
  const status = resolveStatus(domain.status);
  const readyFor = resolveReadyFor(domain.status);

  return (
    <SendingDomainSection title="Status">
      <SendingDomainSection.Left>
        <VerificationHelp status={status} />
      </SendingDomainSection.Left>
      <SendingDomainSection.Right>
        {hasAutoVerifyEnabled && status === 'verified' && (
          <Banner title="Auto-Verify is Enabled" status="info" marginBottom="500">
            As a trusted partner, your domains are automatically verified and ready for immediate
            use pending our compliance check and your domain setup.
          </Banner>
        )}
        <Panel.LEGACY>
          <StatusDescription domain={domain} readyFor={readyFor} status={status} />
          <ShareWithSubaccounts domain={domain} onChange={onShareDomainChange} />
        </Panel.LEGACY>
      </SendingDomainSection.Right>
    </SendingDomainSection>
  );
};
