import React from 'react';
import { Route } from 'react-router-dom';
import { Search } from '@sparkpost/matchbox-icons';
import {
  Box,
  Button,
  Columns,
  Column,
  Page,
  Panel,
  Popover,
  Stack,
  Tabs,
  Checkbox,
  TextField,
} from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { LabelSpacer } from 'src/components/labels';
import useRouter from 'src/hooks/useRouter';
import Domains from './components';
import { SENDING_DOMAINS_URL, BOUNCE_DOMAINS_URL, TRACKING_DOMAINS_URL } from './constants';

export default function DomainsPage() {
  const { history, location } = useRouter();
  // Note - passing in `PageLink` as a component here was possible, however, focus handling was breaking.
  // Additionally, the `role="tab"` works ideally with a button - so better to just do this so keyboard users
  // have some level of control over this UI. Unfortunately things are still a little funky with focus
  // handling with this component - we'll need to address this via Matchbox rather than the app!
  const TABS = [
    {
      content: 'Sending Domains',
      'data-to': SENDING_DOMAINS_URL, // Using a `data-` attribute to store the value to compare against since this ends up rendering to the DOM.
      onClick: () => history.push(SENDING_DOMAINS_URL),
    },
    {
      content: 'Bounce Domains',
      'data-to': BOUNCE_DOMAINS_URL,
      onClick: () => history.push(BOUNCE_DOMAINS_URL),
    },
    {
      content: 'Tracking Domains',
      'data-to': TRACKING_DOMAINS_URL,
      onClick: () => history.push(TRACKING_DOMAINS_URL),
    },
  ];
  const tabIndex = TABS.findIndex(tab => tab['data-to'] === location.pathname);

  return (
    <Domains.Container>
      <Page
        title="Domains"
        primaryAction={{
          to: '/domains/create',
          content: 'Add a Domain',
          component: PageLink,
        }}
      >
        <Stack>
          <Tabs selected={tabIndex} tabs={TABS} />

          <Panel.LEGACY mb="0" borderBottom="0">
            <Panel.LEGACY.Section>
              <Columns>
                <Column>
                  {/* TODO: Replace with FilterBox UI as a part of FE-1154 */}
                  <TextField
                    id="domains-domain-filter"
                    label="Filter Domains"
                    maxWidth="100%"
                    prefix={<Search />}
                  />
                </Column>

                <Column>
                  <LabelSpacer />

                  <Popover
                    id="domains-status-filter"
                    trigger={<Button variant="secondary">Domain Status</Button>}
                  >
                    <Box padding="300">
                      <Checkbox id="domains-status-select-all" label="Select All" />
                    </Box>

                    <Box as="hr" margin="0" />

                    <Box padding="300">
                      <Stack space="200">
                        <Checkbox id="domain-status-sending-domain" label="Sending Domain" />
                        <Checkbox id="domain-status-dkim-signing" label="DKIM Signing" />
                        <Checkbox id="domain-status-bounce" label="Bounce" />
                        <Checkbox id="domain-status-spf-valid" label="SPF Valid" />
                        <Checkbox id="domain-status-dmarc-compliant" label="DMARC Compliant" />
                        <Checkbox id="domain-status-pending" label="Pending Verification" />
                        <Checkbox id="domain-status-failed" label="Failed Verification" />
                        <Checkbox id="domain-status-blocked" label="Blocked" />
                      </Stack>
                    </Box>

                    <Box as="hr" margin="0" />

                    <Box padding="300" display="flex" justifyContent="flex-end">
                      <Button variant="primary" size="small">
                        Apply
                      </Button>
                    </Box>
                  </Popover>
                </Column>
              </Columns>
            </Panel.LEGACY.Section>
          </Panel.LEGACY>
        </Stack>

        <Route
          path={SENDING_DOMAINS_URL}
          render={() => (
            <TabPanel>
              <Domains.SendingDomainsTable />
            </TabPanel>
          )}
        />

        <Route
          path={BOUNCE_DOMAINS_URL}
          render={() => (
            <TabPanel>
              <Domains.SendingDomainsTable renderBounceOnly />
            </TabPanel>
          )}
        />

        <Route
          path={TRACKING_DOMAINS_URL}
          render={() => (
            <TabPanel>
              <Domains.TrackingDomainsTable />
            </TabPanel>
          )}
        />
      </Page>
    </Domains.Container>
  );
}

function TabPanel({ children }) {
  return <div role="tabpanel">{children}</div>;
}
