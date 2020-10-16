import React from 'react';
import { Button, Layout, Stack, TextField, Tag, Text } from 'src/components/matchbox';
import { Checkbox, Panel } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { Send } from '@sparkpost/matchbox-icons';
import { resolveReadyFor } from 'src/helpers/domains';
import useDomains from '../hooks/useDomains';
import { ExternalLink, SubduedLink } from 'src/components/links';
import styled from 'styled-components';
import { CopyField } from 'src/components';
import { EXTERNAL_LINKS } from '../constants';

const PlaneIcon = styled(Send)`
  transform: translate(0, -25%) rotate(-45deg);
`;

const Field = ({ verified, label, value }) => {
  if (!verified) return <CopyField label={label} value={value} />;
  return <TextField label={label} value={value} readOnly />;
};

export default function SetupForSending({ domain, isSectionVisible }) {
  const { verifyDkim, showAlert, userName, verifyDkimLoading } = useDomains();
  const readyFor = resolveReadyFor(domain.status);

  const handleVerifyDkim = () => {
    const { id, subaccount_id: subaccount } = domain;

    return verifyDkim({ id, subaccount }).then(results => {
      const readyFor = resolveReadyFor(results);

      if (readyFor.dkim) {
        showAlert({
          type: 'success',
          message: `You have successfully verified DKIM record of ${id}`,
        });
      } else {
        showAlert({
          type: 'error',
          message: `Unable to verify DKIM record of ${id}. ${results.dns.dkim_error}`,
        });
      }
    });
  };
  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">
          {!readyFor.dkim ? 'DNS Verification' : 'Sending'}
        </Layout.SectionTitle>
        {!readyFor.dkim && (
          <>
            <Tag color="green" mb="200">
              Recommended
            </Tag>
            <Stack>
              <SubduedText fontSize="200">
                DKIM (DomainKeys Identified Mail) is an email authentication method that allows a
                sender to claim responsibility for a message by using digital signatures generated
                from private and public keys. DKIM failures can cause messages to be rejected, so
                SparkPost requires a DKIM record published for all sending domains before they can
                be verified and used, in order to ensure DKIM checks are passed.
              </SubduedText>

              <SubduedLink
                as={ExternalLink}
                to={EXTERNAL_LINKS.SENDING_DOMAINS_DOCUMENTATION}
                fontSize="200"
              >
                Sending Domain Documentation
              </SubduedLink>
            </Stack>
          </>
        )}
      </Layout.Section>
      <Layout.Section>
        <Panel>
          {!readyFor.dkim ? (
            <Panel.Section>
              Add these{' '}
              <Text as="span" fontWeight="semibold">
                TXT
              </Text>{' '}
              records, Hostnames and Values for this domain in the settings section of your DNS
              provider.
              <Panel.Action>
                <ExternalLink
                  to={`mailto:?subject=Assistance%20Requested%20Verifying%20a%20Sending%20Domain%20on%20SparkPost&body=${userName}%20has%20requested%20your%20assistance%20verifying%20a%20sending%20domain%20with%20SparkPost.%20Follow%20the%20link%20below%20to%20find%20the%20values%20you%E2%80%99ll%20need%20to%20add%20to%20the%20settings%20of%20your%20DNS%20provider.%0D%0A%5BGo%20to%20SparkPost%5D(${window.location})%0D%0A`}
                  icon={PlaneIcon}
                >
                  Forward to Colleague
                </ExternalLink>
              </Panel.Action>
            </Panel.Section>
          ) : (
            <Panel.Section>
              Below is the{' '}
              <Text as="span" fontWeight="semibold">
                TXT
              </Text>{' '}
              record for the Hostname and DKIM value of this domain.
            </Panel.Section>
          )}
          <Panel.Section>
            <Stack>
              {!readyFor.dkim && (
                <>
                  <Text as="label" fontWeight="500" fontSize="200">
                    Type
                  </Text>
                  <Text as="p">TXT</Text>
                </>
              )}
              <Field label="Hostname" value={domain.dkimHostname} verified={readyFor.dkim} />
              <Field label="Value" value={domain.dkimValue} verified={readyFor.dkim} />
              {!readyFor.dkim && (
                <Checkbox
                  id="add-txt-to-godaddy"
                  label={<>The TXT record has been added to the DNS provider</>}
                />
              )}
              {/*API doesn't support it; Do we want to store this in ui option*/}
            </Stack>
          </Panel.Section>
          {!readyFor.dkim && (
            <Panel.Section>
              <Button variant="primary" onClick={handleVerifyDkim} loading={verifyDkimLoading}>
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
