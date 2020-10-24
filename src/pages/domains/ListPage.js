import React from 'react';
import { Page, Stack, Tabs } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { useHistory, useLocation } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';
import Domains from './components';
import { SENDING_DOMAINS_URL, BOUNCE_DOMAINS_URL, TRACKING_DOMAINS_URL } from './constants';

export default function DomainsPage() {
  const history = useHistory();
  const location = useLocation();
  // let [filters, setFilters] = useState({});
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
  // eslint-disable-next-line no-unused-vars

  const matchesSendingTab = useRouteMatch(SENDING_DOMAINS_URL);
  const matchesBounceTab = useRouteMatch(BOUNCE_DOMAINS_URL);
  const matchesTrackingTab = useRouteMatch(TRACKING_DOMAINS_URL);

  // const { filters, updateFilters } = usePageFilters({});

  const renderTab = () => {
    if (matchesSendingTab) {
      return <Domains.SendingDomainsTab />;
    }
    if (matchesBounceTab) {
      return <Domains.SendingDomainsTab renderBounceOnly />;
    }
    if (matchesTrackingTab) {
      return <Domains.TrackingDomainsTab />;
    }
  };

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
          <div>
            <TabPanel>{renderTab()}</TabPanel>
          </div>
        </Stack>
      </Page>
    </Domains.Container>
  );
}

function TabPanel({ children }) {
  return <div role="tabpanel">{children}</div>;
}
