import React from 'react';
import { Layout, Stack, Text } from 'src/components/matchbox';
import { Checkbox, Columns, Column, Panel, Tooltip } from 'src/components/matchbox';
import { Heading, SubduedText } from 'src/components/text';
import { SendingDomainStatusCell as StatusCell } from './SendingDomainStatusCell';
import TrackingDomainStatusCell from './TrackingDomainStatusCell';
import { Bookmark } from '@sparkpost/matchbox-icons';
import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';
import useDomains from '../hooks/useDomains';
import useModal from 'src/hooks/useModal';
import { ExternalLink, SubduedLink } from 'src/components/links';
import { ToggleBlock } from 'src/components';
import { EXTERNAL_LINKS } from '../constants';
import { ConfirmationModal } from 'src/components/modals';
import _ from 'lodash';

export default function DomainStatusSection({ domain, id, isTracking }) {
  const { closeModal, isModalOpen, openModal } = useModal();
  const {
    allowDefault,
    allowSubaccountDefault,
    updateSendingDomain,
    trackingDomains,
    updateTrackingDomain,
    listTrackingDomains,
    updateTrackingPending,
  } = useDomains();
  const readyFor = resolveReadyFor(domain.status);
  const resolvedStatus = resolveStatus(domain.status);
  const showDefaultBounceSubaccount =
    !domain.subaccount_id || (domain.subaccount_id && allowSubaccountDefault);
  const showDefaultBounceToggle =
    allowDefault && readyFor.sending && readyFor.bounce && showDefaultBounceSubaccount;

  const trackingDomain = _.find(trackingDomains, ['domainName', id.toLowerCase()]);

  const toggleDefaultBounce = () => {
    return updateSendingDomain({
      id,
      subaccount: domain.subaccount_id,
      is_default_bounce_domain: !domain.is_default_bounce_domain,
    }).catch(err => {
      throw err; // for error reporting
    });
  };

  const toggleDefaultTracking = () => {
    return updateTrackingDomain({
      domain: trackingDomain?.domainName,
      subaccount: trackingDomain.subaccountId,
      default: !trackingDomain.defaultTrackingDomain,
    })
      .catch(_.noop) // ignore errors
      .then(() => listTrackingDomains());
  };

  const toggleShareWithSubaccounts = () => {
    return updateSendingDomain({
      id,
      subaccount: domain.subaccount_id,
      shared_with_subaccounts: !domain.shared_with_subaccounts,
    }).catch(err => {
      throw err; // for error reporting
    });
  };

  if (isTracking && trackingDomain) {
    const isDefault = trackingDomain.defaultTrackingDomain;
    const domainName = trackingDomain?.domainName;

    return (
      <Layout>
        <Layout.Section annotated>
          <Layout.SectionTitle as="h2">Domain Status</Layout.SectionTitle>
          <SubduedLink
            as={ExternalLink}
            to={EXTERNAL_LINKS.TRACKING_DOMAIN_DOCUMENTATION}
            fontSize="200"
          >
            Tracking Domain Documentation
          </SubduedLink>
        </Layout.Section>
        <Layout.Section>
          <Panel>
            <Panel.Section>
              <Columns space="100">
                <Column>
                  <Heading as="h3" looksLike="h5">
                    Domain
                  </Heading>
                  <Text as="p">{domainName}</Text>
                </Column>
                <Column>
                  <Heading as="h3" looksLike="h5">
                    Status
                  </Heading>
                  <TrackingDomainStatusCell row={trackingDomain} />
                </Column>
              </Columns>
            </Panel.Section>

            {trackingDomain?.subaccountId && (
              <Panel.Section>
                <Heading as="h3" looksLike="h5">
                  Subaccount Assignment
                </Heading>
                <Text as="p">Subaccount {trackingDomain?.subaccountId}</Text>
              </Panel.Section>
            )}

            {trackingDomain.verified && (
              <Panel.Section>
                <Checkbox
                  id="set-as-default-tracking-domain"
                  label={
                    <>
                      Set as Default Tracking Domain <Bookmark color="green" />
                    </>
                  }
                  checked={trackingDomain.defaultTrackingDomain}
                  onClick={() => openModal()}
                />

                <ConfirmationModal
                  open={isModalOpen}
                  title={`${isDefault ? 'Remove' : 'Set'} default tracking domain (${domainName})`}
                  content={
                    <p>
                      {isDefault
                        ? `Transmissions and templates that don't specify a tracking domain will no longer use ${domainName}. Instead, they will use the system default until another default is selected.`
                        : `Transmissions and templates that don't specify a tracking domain will now use ${domainName}.`}
                    </p>
                  }
                  isPending={updateTrackingPending}
                  onCancel={() => closeModal()}
                  onConfirm={() => toggleDefaultTracking()}
                  confirmVerb={isDefault ? 'Remove Default' : 'Set as Default'}
                />
              </Panel.Section>
            )}
          </Panel>
        </Layout.Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Domain Status</Layout.SectionTitle>
        <Stack>
          {resolvedStatus === 'unverified' && (
            <SubduedText fontSize="200">
              This domain failed authentication. It can take 24 to 48 hours for the DNS record to
              propogate. For other reasons why this ay have happenedchek out our domain
              authentication documentation.
            </SubduedText>
          )}
          {resolvedStatus === 'unverified' && (
            <SubduedLink
              as={ExternalLink}
              to={EXTERNAL_LINKS.VERIFY_SENDING_DOMAIN_OWNERSHIP}
              fontSize="200"
            >
              Domain Documentation
            </SubduedLink>
          )}
          {resolvedStatus === 'verified' && (
            <Stack>
              <SubduedLink
                as={ExternalLink}
                to={EXTERNAL_LINKS.SENDING_DOMAINS_DOCUMENTATION}
                fontSize="200"
              >
                Sending Domain Documentation
              </SubduedLink>
              <SubduedLink
                as={ExternalLink}
                to={EXTERNAL_LINKS.SENDING_DOMAINS_API_DOCUMENTATION}
                fontSize="200"
              >
                Sending Domain API Documentation
              </SubduedLink>
            </Stack>
          )}
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
                    variant="dense"
                  />
                </Panel.Section>
              )}
              {showDefaultBounceToggle && (
                <>
                  <Panel.Section>
                    <Checkbox
                      id="set-as-default-bounce-domain"
                      label={
                        <>
                          Set as Default Bounce Domain{' '}
                          <Tooltip
                            id="default-bounce-tooltip"
                            dark
                            content={`When this is set to "ON", all future transmissions ${
                              domain.subaccount_id ? 'for this subaccount ' : ''
                            }will use ${id} as their bounce domain (unless otherwise specified).`}
                          >
                            <Bookmark color="green" />
                          </Tooltip>
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
    </Layout>
  );
}
