import React from 'react';
import { Route } from 'react-router-dom';
import { Page, Panel, Stack, Tabs } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import useRouter from 'src/hooks/useRouter';
import useTabs from 'src/hooks/useTabs';
import { DomainsLayout } from './components';
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
  const [selectedTabIndex, tabs] = useTabs(TABS, tabIndex);

  return (
    <DomainsLayout>
      <Page
        title="Domains"
        primaryAction={{
          to: '/domains/create',
          content: 'Add a Domain',
          component: PageLink,
        }}
      >
        <Stack>
          <Tabs selected={selectedTabIndex} tabs={tabs} />

          <Panel mb="0">
            <Panel.Section>
              <Route
                path={SENDING_DOMAINS_URL}
                render={() => (
                  <div role="tabpanel">
                    <h2>Sending domains table goes here</h2>
                  </div>
                )}
              />

              <Route
                path={TRACKING_DOMAINS_URL}
                render={() => (
                  <div role="tabpanel">
                    <h2>Tracking domains table goes here</h2>
                  </div>
                )}
              />

              <Route
                path={BOUNCE_DOMAINS_URL}
                render={() => (
                  <div role="tabpanel">
                    <h2>Bounce domains table goes here</h2>
                  </div>
                )}
              />
            </Panel.Section>
          </Panel>
        </Stack>
      </Page>
    </DomainsLayout>
  );
}
