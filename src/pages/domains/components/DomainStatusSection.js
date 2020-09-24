import React from 'react';
import { Layout, Stack, Text } from 'src/components/matchbox';
import { Checkbox, Columns, Column, Panel } from 'src/components/matchbox';
import { Heading, SubduedText } from 'src/components/text';
import { SendingDomainStatusCell as StatusCell } from './SendingDomainStatusCell';
import { Bookmark } from '@sparkpost/matchbox-icons';
import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';
import useDomains from '../hooks/useDomains';
import { ExternalLink } from 'src/components/links';
import { ToggleBlock } from 'src/components';

export default function DomainStatusSection(props) {
  const { allowDefault, allowSubaccountDefault, domain } = props;
  const readyFor = resolveReadyFor(domain.status);
  const resolvedStatus = resolveStatus(domain.status);
  const showDefaultBounceSubaccount =
    !domain.subaccount_id || (domain.subaccount_id && allowSubaccountDefault);
  const showDefaultBounceToggle =
    allowDefault && readyFor.sending && readyFor.bounce && showDefaultBounceSubaccount;
  const { updateSendingDomain } = useDomains();

  const toggleDefaultBounce = () => {
    const { id } = props;

    return updateSendingDomain({
      id,
      subaccount: domain.subaccount_id,
      is_default_bounce_domain: !domain.is_default_bounce_domain,
    }).catch(err => {
      throw err; // for error reporting
    });
  };

  const toggleShareWithSubaccounts = () => {
    const { id } = props;

    return updateSendingDomain({
      id,
      subaccount: domain.subaccount_id,
      shared_with_subaccounts: !domain.shared_with_subaccounts,
    }).catch(err => {
      throw err; // for error reporting
    });
  };

  return (
    <>
      <Layout.Section annotated>
        <Stack>
          <Layout.SectionTitle as="h2">Domain Status</Layout.SectionTitle>
          {resolvedStatus === 'unverified' && (
            <SubduedText>
              This domain failed authentication. It can take 24 to 48 hours for the DNS record to
              propogate. For other reasons why this ay have happenedchek out our domain
              authentication documentation.
            </SubduedText>
          )}
          <ExternalLink to="https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#sending-domain-step-2-verifying-domain-ownership">
            Documentation
          </ExternalLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          <Panel.Section>
            <Columns space="100">
              <Column>
                <Heading as="h3" looksLike="h5">
                  Domain
                </Heading>
                <Text as="p">{domain.dkim?.signing_domain}</Text>
              </Column>
              <Column>
                <Heading as="h3" looksLike="h5">
                  Status
                </Heading>
                <StatusCell domain={domain} />
              </Column>
              {domain.creation_time ? (
                <Column>
                  <Heading as="h3" looksLike="h5">
                    Date Added
                  </Heading>
                  <Text as="p">
                    {new Date(domain.creation_time).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </Column>
              ) : (
                <Column />
              )}
            </Columns>
          </Panel.Section>
          {resolvedStatus !== 'blocked' && (
            <>
              {domain.subaccount_id ? (
                <Panel.Section>
                  <Heading as="h3" looksLike="h5">
                    Subaccount Assignment
                  </Heading>
                  <Text as="p">Subaccount {domain.subaccount_id}</Text>
                </Panel.Section>
              ) : (
                <Panel.Section>
                  <ToggleBlock
                    input={{
                      name: 'share-with-all-subaccounts',
                      checked: domain.shared_with_subaccounts,
                      onChange: toggleShareWithSubaccounts,
                    }}
                    label="Share this domain with all subaccounts"
                  />
                </Panel.Section>
              )}
              {showDefaultBounceToggle && (
                <>
                  <Panel.Section>
                    <Checkbox
                      id="set-as-default-domain"
                      label={
                        <>
                          Set as Default Bounce Domain <Bookmark color="green" />
                        </>
                      }
                      checked={domain.is_default_bounce_domain}
                      onClick={toggleDefaultBounce}
                    />
                  </Panel.Section>
                </>
              )}
            </>
          )}
        </Panel>
      </Layout.Section>
    </>
  );
}
