/* eslint-disable max-lines */
import {
  Home,
  People,
  Code,
  List,
  NotificationsActive,
  Settings,
  BarChart,
  GridOff,
} from '@sparkpost/matchbox-icons';
import { hasGrants } from 'src/helpers/conditions';
import inboxPlacementNavItems from './inboxPlacement';

const dashboard = {
  label: 'Dashboard',
  to: '/dashboard',
  icon: Home,
};

const signalsAnalytics = {
  label: 'Signals Analytics',
  to: '/reports',
  icon: BarChart,
  children: [
    {
      label: 'Summary',
      to: '/reports/summary',
    },
    {
      label: 'Bounce',
      to: '/reports/bounce',
    },
    {
      label: 'Rejections',
      to: '/reports/rejections',
    },
    {
      label: 'Accepted',
      to: '/reports/accepted',
    },
    {
      label: 'Delayed',
      to: '/reports/delayed',
    },
    {
      label: 'Health Score',
      to: '/signals/health-score',
      divider: true,
    },
    {
      label: 'Spam Traps',
      to: '/signals/spam-traps',
    },
    {
      label: 'Engagement Recency',
      to: '/signals/engagement',
      divider: true,
    },
    {
      label: 'Engagement',
      to: '/reports/engagement',
    },
  ],
};

const events = {
  label: 'Events',
  to: '/reports/message-events',
  icon: List,
};

const content = {
  label: 'Content',
  to: '/templates',
  icon: Code,
  children: [
    {
      label: 'Templates',
      to: '/templates',
    },
    {
      label: 'A/B Testing',
      to: '/ab-testing',
    },
    {
      label: 'Snippets',
      to: '/snippets',
    },
  ],
};

const recipients = {
  label: 'Recipients',
  to: '/lists',
  icon: People,
  children: [
    {
      label: 'Recipient Validation',
      to: '/recipient-validation/list',
      condition: hasGrants('recipient-validation/preview'),
    },
    {
      label: 'Recipient Lists',
      to: '/lists/recipient-lists',
    },
    {
      label: 'Suppressions',
      to: '/lists/suppressions',
    },
  ],
};

const alerts = {
  label: 'Alerts',
  to: '/alerts',
  icon: NotificationsActive,
};

const blocklist = {
  label: 'Blocklist',
  icon: GridOff,
  tag: 'preview',
  to: '/blocklist/incidents',
};

const webhooks = {
  label: 'Webhooks',
  to: '/webhooks',
};

const IPPools = {
  label: 'IP Pools',
  to: '/account/ip-pools',
};

const APIKeys = {
  label: 'API Keys',
  to: '/account/api-keys',
};

const SMTPSettings = {
  label: 'SMTP Settings',
  to: '/account/smtp',
};

const signalsIntegration = {
  label: 'Signals Integration',
  to: '/signals/integration',
  divider: true,
};

const sendingDomains = {
  label: 'Sending Domains',
  to: '/account/sending-domains',
  divider: true,
};

const trackingDomains = {
  label: 'Tracking Domains',
  to: '/account/tracking-domains',
};

const subaccounts = {
  label: 'Subaccounts',
  to: '/account/subaccounts',
  divider: true,
};

const configurationBase = {
  label: 'Configuration',
  to: '/account',
  icon: Settings,
};

const OGConfiguration = {
  ...configurationBase,
  children: [
    webhooks,
    IPPools,
    APIKeys,
    SMTPSettings,
    signalsIntegration,
    sendingDomains,
    trackingDomains,
    subaccounts,
  ],
};

const hibanaConfiguration = {
  ...configurationBase,
  children: [
    sendingDomains,
    trackingDomains,
    webhooks,
    IPPools,
    APIKeys,
    SMTPSettings,
    signalsIntegration,
  ],
};

export const navItems = [
  dashboard,
  signalsAnalytics,
  events,
  content,
  recipients,
  alerts,
  inboxPlacementNavItems,
  blocklist,
  OGConfiguration,
];

export const hibanaNavItems = [
  signalsAnalytics,
  events,
  content,
  recipients,
  inboxPlacementNavItems,
  blocklist,
  hibanaConfiguration,
];
