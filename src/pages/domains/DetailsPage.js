import React, { useEffect } from 'react';
import { Button, Page, Layout, Stack, Text } from 'src/components/matchbox';
import { Checkbox, Columns, Column, Panel } from 'src/components/matchbox';
import { Heading, SubduedText } from 'src/components/text';
import { get as getDomain } from 'src/actions/sendingDomains';
import Domains from './components';
import { SendingDomainStatusCell as StatusCell } from './components/SendingDomainStatusCell';
import { connect } from 'react-redux';
import { Bookmark, Send } from '@sparkpost/matchbox-icons';
import { resolveReadyFor } from 'src/helpers/domains';
import {
  selectAllowDefaultBounceDomains,
  selectAllSubaccountDefaultBounceDomains,
} from 'src/selectors/account';
import useDomains from './hooks/useDomains';
import { ExternalLink, PageLink } from 'src/components/links';
import { selectDomain } from 'src/selectors/sendingDomains';
import styled from 'styled-components';
import { CopyField } from 'src/components';

const PlaneIcon = styled(Send)`
  transform: translate(0, -25%) rotate(-45deg);
`;

function DetailsPage(props) {
  useEffect(() => {
    props.getDomain(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Domains.Container>
      <Page
        title="Domain Details"
        breadcrumbAction={{
          content: 'All Domains',
          //TODO - should differ based on what the previous link was
          onClick: () => props.history.push('/domains/list/sending'),
        }}
      >
        <Layout>
          <DomainStatusSection
            domain={props.domain}
            id={props.match.params.id}
            allowDefault
            allowSubaccountDefault
          />
        </Layout>
        {/* <Layout>
          <DNSDetailsSection domain={props.domain} id={props.match.params.id} />
        </Layout> */}
        {/* this section is a placeholder */}
        <Layout>
          <SetupForSending domain={props.domain} id={props.match.params.id} />
        </Layout>
        <Layout>
          <DeleteDomainSection />
        </Layout>
      </Page>
    </Domains.Container>
  );
}

export default connect(
  state => ({
    domain: selectDomain(state),
    allowDefault: selectAllowDefaultBounceDomains(state),
    allowSubaccountDefault: selectAllSubaccountDefaultBounceDomains(state),
  }),
  { getDomain },
)(DetailsPage);

{
  /* this section is a placeholder */
}
// function DNSDetailsSection(props) {
//   return (
//     <>
//       <Layout.Section annotated>
//         <Layout.SectionTitle as="h2">DNS Details</Layout.SectionTitle>
//         <Stack>
//           <SubduedText>
//             Something about these records being successfully placed in Go-Daddy?
//           </SubduedText>
//           <ExternalLink>Documentation</ExternalLink>
//           <SubduedText>
//             We've noticed this domain is not SPF authenticated. We think you should do this because
//             it is super important. Please add the info on the right to your DNS platform.
//           </SubduedText>
//         </Stack>
//       </Layout.Section>
//       <Layout.Section>
//         <Panel>
//           <Panel.Section>
//             Below is the{' '}
//             <Text as="span" fontWeight="semibold">
//               CNAME{' '}
//             </Text>{' '}
//             record for the Hostname and Value for this domain hosted at{' '}
//             <PageLink>Go-Daddy</PageLink>
//           </Panel.Section>
//           <Panel.Section>
//             <Stack>
//               <TextField
//                 id="dns-hostname"
//                 label="Hostname"
//                 value={props.domain.dkimHostname} //not sure what these values should be
//                 readOnly
//               />
//               <TextField id="dns-hostname" label="Value" value={props.domain.dkimValue} readOnly />{' '}
//               {/*Not sure what this value is */}
//             </Stack>
//           </Panel.Section>
//           <Panel.Section>
//             <Stack>
//               <Box>
//                 <Text as="span" fontSize="400" fontWeight="semibold">
//                   Add SPF Record <Tag color="green">Recommended</Tag>
//                 </Text>
//                 <StyledText as="span" fontSize="400" color="gray.400">
//                   Optional
//                 </StyledText>
//               </Box>
//               <CopyField label="Hostname" value={props.domain.dkimHostname}></CopyField>
//               <CopyField label="Value" value={props.domain.dkimValue}></CopyField>
//               <Checkbox
//                 id="add-txt-to-godaddy"
//                 label={<>I've added TXT record to Go-Daddy</>}
//                 checked={false}
//                 onClick={() => {}}
//               />
//             </Stack>
//           </Panel.Section>
//           <Panel.Section>
//             <Button variant="primary">Authenticate for SPF</Button>
//             {/* Functionality not available */}
//           </Panel.Section>
//         </Panel>
//       </Layout.Section>
//     </>
//   );
// }

function SetupForSending(props) {
  return (
    <>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Set up for Sending</Layout.SectionTitle>
        <Stack>
          <SubduedText>
            This will make this domain ready for sending and DKIM-signing, verifying ownership and
            at the same time resulting in better DKIM alignment.
          </SubduedText>
          <ExternalLink>Documentation</ExternalLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          <Panel.Section>
            Install these records, Hostnames and Values for this domain in the DNS settings at{' '}
            <PageLink>Go-Daddy</PageLink>
            <Panel.Action>
              Forward to Collegue <PlaneIcon />
            </Panel.Action>
          </Panel.Section>

          <Panel.Section>
            <Stack>
              <CopyField label="Hostname" value={props.domain.dkimHostname}></CopyField>
              <CopyField label="Value" value={props.domain.dkimValue}></CopyField>
              <Checkbox
                id="add-txt-to-godaddy"
                label={<>I've added TXT record to Go-Daddy</>}
                checked={false}
                onClick={() => {}}
              />
            </Stack>
          </Panel.Section>
          <Panel.Section>
            <Button variant="primary">Verify Domain</Button>
            {/* Functionality not available */}
          </Panel.Section>
        </Panel>
      </Layout.Section>
    </>
  );
}

function DomainStatusSection(props) {
  const { allowDefault, allowSubaccountDefault, domain } = props;
  const readyFor = resolveReadyFor(domain.status);
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
          <ExternalLink>Documentation</ExternalLink>
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
          {domain.subaccount_id ? (
            <Panel.Section>
              <Heading as="h3" looksLike="h5">
                Subaccount Assignment
              </Heading>
              <Text as="p">Subaccount {domain.subaccount_id}</Text>
              {/* <Panel.Action>
                Change Assignment <ChevronRight /> // We don't have API to support this 
              </Panel.Action> */}
            </Panel.Section>
          ) : (
            <Panel.Section>
              <Checkbox
                id="share-with-all-subaccounts"
                label={<>Share this domain with all subaccounts</>}
                checked={domain.shared_with_subaccounts}
                onClick={toggleShareWithSubaccounts}
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
        </Panel>
      </Layout.Section>
    </>
  );
}

function DeleteDomainSection() {
  return (
    <>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Delete Domain</Layout.SectionTitle>
      </Layout.Section>
      <Layout.Section>
        <Panel accent="red">
          <Panel.Section>
            If you delete this domain its FINAL..... something else here
          </Panel.Section>

          <Panel.Section>
            <Button variant="destructive">Delete Domain</Button>
            {/* Functionality not available */}
          </Panel.Section>
        </Panel>
      </Layout.Section>
    </>
  );
}
