import { blocklist } from 'src/pages';
import App from 'src/components/layout/App';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';

const blocklistRoutes = [
  {
    path: '/blocklist/incidents',
    component: blocklist.IncidentsPage,
    layout: App,
    condition: hasAccountOptionEnabled('blacklist_monitors'),
    title: 'Blocklist Incidents',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
  {
    path: '/blocklist/watchlist',
    component: blocklist.WatchlistPage,
    layout: App,
    condition: hasAccountOptionEnabled('blacklist_monitors'),
    title: 'Watched Monitors',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
  {
    path: '/blocklist/watchlist/add',
    component: blocklist.WatchlistAddPage,
    condition: hasAccountOptionEnabled('blacklist_monitors'),
    layout: App,
    title: 'Add to Watch List | Blocklist',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
  {
    path: '/blocklist/incidents/:id',
    component: blocklist.IncidentDetailsPage,
    condition: hasAccountOptionEnabled('blacklist_monitors'),
    layout: App,
    title: 'Incident Details | Blocklist',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
];

export default blocklistRoutes;
