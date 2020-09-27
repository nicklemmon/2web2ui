import React from 'react';
import { Button, Layout, Stack, TextField, Text } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import useDomains from '../hooks/useDomains';
import { CopyField } from 'src/components';

import _ from 'lodash';

const Field = ({ verified, label, value }) => {
  if (!verified) return <CopyField label={label} value={value} />;
  return <TextField label={label} value={value} readOnly />;
};

export default function TrackingDnsSection(props) {
  const { trackingDomains, verifyTrackingDomain } = useDomains();
  let trackingDomain = _.find(trackingDomains, ['domainName', props.id]) || {};
  const { unverified } = trackingDomain;

  const handleVerify = () => {
    return verifyTrackingDomain({
      domain: trackingDomain.domainName,
      subaccountId: trackingDomain.subaccountId,
    });
  };
  if (!props.isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Tracking</Layout.SectionTitle>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          {unverified ? (
            <Panel.Section>
              Add these{' '}
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
              <Field label="Hostname" value={trackingDomain.domainName} verified={!unverified} />
              <Field label="Value" value="placeholder" verified={!unverified} />
            </Stack>
          </Panel.Section>
          {unverified && (
            <Panel.Section>
              <Button variant="primary" onClick={handleVerify}>
                Verify Domain
              </Button>
              {/* Functionality not available */}
            </Panel.Section>
          )}
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
