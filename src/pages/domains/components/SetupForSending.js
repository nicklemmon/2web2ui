import React from 'react';
import { Button, Layout, Stack, Tag, Text } from 'src/components/matchbox';
import { Checkbox, Panel } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { Send } from '@sparkpost/matchbox-icons';
import { resolveReadyFor } from 'src/helpers/domains';
import useDomains from '../hooks/useDomains';
import { ExternalLink } from 'src/components/links';
import styled from 'styled-components';
import { CopyField } from 'src/components';

const PlaneIcon = styled(Send)`
  transform: translate(0, -25%) rotate(-45deg);
`;

export default function SetupForSending({ domain, resolvedStatus }) {
  const { verifyDkim, showAlert } = useDomains();

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
  return (
    <>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">
          {resolvedStatus === 'unverified' ? 'DNS Verification' : 'Sending'}
        </Layout.SectionTitle>
        {resolvedStatus === 'unverified' && (
          <>
            <Tag color="green" mb="200">
              Recommended
            </Tag>
            <Stack>
              <SubduedText>
                DKIM (DomainKeys Identified Mail) is an email authentication method that allows a
                sender to claim responsibility for a message by using digital signatures generated
                from private and public keys. DKIM failures can cause messages to be rejected, so
                SparkPost requires a DKIM record published for all sending domains before they can
                be verified and used, in order to ensure DKIM checks are passed.
              </SubduedText>

              <ExternalLink to="/">Documentation</ExternalLink>
            </Stack>
          </>
        )}
      </Layout.Section>
      <Layout.Section>
        <Panel>
          {resolvedStatus !== 'verified' ? (
            <Panel.Section>
              Add these{' '}
              <Text as="span" fontWeight="semibold">
                TXT
              </Text>{' '}
              records, Hostnames and Values for this domain in the settings section of your DNS
              provider.
              <Panel.Action>
                <ExternalLink
                  to="mailto:abc@example.com?subject=todo-get-subject&body=todo-get-message"
                  icon={PlaneIcon}
                >
                  Forward to Collegue
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
              <>
                <Text as="label" fontWeight="500" fontSize="200">
                  Type
                </Text>
                <Text as="p">TXT</Text>
              </>
              <CopyField label="Hostname" value={domain.dkimHostname}></CopyField>
              <CopyField label="Value" value={domain.dkimValue}></CopyField>
              {resolvedStatus !== 'verified' && (
                <Checkbox
                  id="add-txt-to-godaddy"
                  label={<>The TXT record has been added to the DNS provider</>}
                />
              )}
              {/*API doesn't support it; Do we want to store this in ui option*/}
            </Stack>
          </Panel.Section>
          {resolvedStatus !== 'verified' && (
            <Panel.Section>
              <Button variant="primary" onClick={handleVerifyDkim}>
                Verify Domain
              </Button>
              {/* Functionality not available */}
            </Panel.Section>
          )}
        </Panel>
      </Layout.Section>
    </>
  );
}
