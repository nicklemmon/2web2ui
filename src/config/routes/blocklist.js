import { blocklist } from 'src/pages';
import App from 'src/components/layout/App';
import { hasAccountOptionEnabled } from 'src/helpers/conditions/account';

const blocklistRoutes = [
  {
    path: '/signals/blocklist/incidents',
    component: blocklist.IncidentsPage,
    layout: App,
    condition: hasAccountOptionEnabled('blocklist_monitors'),
    title: 'Blocklist Incidents',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
  {
    path: '/signals/blocklist/monitors',
    component: blocklist.WatchlistPage,
    layout: App,
    condition: hasAccountOptionEnabled('blocklist_monitors'),
    title: 'Watched Monitors',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
  {
    path: '/signals/blocklist/monitors/add',
    component: blocklist.WatchlistAddPage,
    condition: hasAccountOptionEnabled('blocklist_monitors'),
    layout: App,
    title: 'Add to Watch List | Blocklist',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
  {
    path: '/signals/blocklist/incidents/:id',
    component: blocklist.IncidentDetailsPage,
    condition: hasAccountOptionEnabled('blocklist_monitors'),
    layout: App,
    title: 'Incident Details | Blocklist',
    supportDocSearch: 'blocklist',
    category: 'Blocklist',
  },
];

export default blocklistRoutes;

export const hibanaBlocklistRoutes = blocklistRoutes.map(route => ({
  ...route,
  category: 'Signals Analytics',
  subcategory: 'Blocklist',
}));
