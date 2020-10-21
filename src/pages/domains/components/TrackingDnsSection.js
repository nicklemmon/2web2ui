import React, { useState } from 'react';
import { Button, Layout, Stack, Text } from 'src/components/matchbox';
import { Panel, Checkbox } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { ExternalLink, SubduedLink } from 'src/components/links';
import useDomains from '../hooks/useDomains';
import { CopyField } from 'src/components';
import { EXTERNAL_LINKS } from '../constants';

import _ from 'lodash';

export default function TrackingDnsSection({ id, isSectionVisible, title }) {
  const { trackingDomains, verifyTrackingDomain, verifyingTrackingPending } = useDomains();
  let trackingDomain = _.find(trackingDomains, ['domainName', id.toLowerCase()]) || {};
  const { unverified } = trackingDomain;
  const [checked, toggleChecked] = useState(!!unverified);

  const handleVerify = () => {
    return verifyTrackingDomain({
      domain: trackingDomain.domainName,
      subaccountId: trackingDomain.subaccountId,
    });
  };
  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Stack>
          <Layout.SectionTitle as="h2">{title || 'Tracking'} </Layout.SectionTitle>
          {unverified && (
            <SubduedText>
              Tracking domains are used by mail providers to determine where engagement rate (like
              opens and clicks) should be sent. This allows you to measure the health of your email
              campaigns so that your team is able to create content and mailing lists that maximize
              your potential.
            </SubduedText>
          )}
          <SubduedLink as={ExternalLink} to={EXTERNAL_LINKS.TRACKING_DOMAIN_DOCUMENTATION}>
            Tracking Domain Documentation
          </SubduedLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          {unverified ? (
            <Panel.Section>
              Add the{' '}
              <Text as="span" fontWeight="semibold">
                CNAME
              </Text>{' '}
              records, Hostnames and Values for this domain in the settings section of your DNS
              provider.
            </Panel.Section>
          ) : (
            <Panel.Section>
              Below is the{' '}
              <Text as="span" fontWeight="semibold">
                CNAME
              </Text>{' '}
              record for this domain at your DNS provider.
            </Panel.Section>
          )}
          <Panel.Section>
            <Stack>
              {unverified && (
                <>
                  <Text as="label" fontWeight="500" fontSize="200">
                    Type
                  </Text>
                  <Text as="p">TXT</Text>
                </>
              )}
              <CopyField label="Hostname" value={trackingDomain.domainName} hideCopy={true} />
              <CopyField label="Value" value="placeholder" hideCopy={!unverified} />
            </Stack>

            {unverified && (
              <Checkbox
                mt="600"
                mb="100"
                onChange={() => toggleChecked(!checked)}
                label={<>The CNAME record has been added to the DNS provider</>}
              />
            )}
          </Panel.Section>

          {unverified && (
            <Panel.Section>
              <Button
                variant="primary"
                onClick={handleVerify}
                disabled={!checked}
                loading={verifyingTrackingPending}
              >
                Verify Domain
              </Button>
            </Panel.Section>
          )}
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
