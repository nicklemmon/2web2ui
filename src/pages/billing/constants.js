export const FEATURE_COMPARISON = {
  'Standard Features': {
    'Signals Predictive Analytics': {
      'Test Account': true,
      'Starter Plans': true,
      'Premier Plans': true,
    },
    'Spam Trap Monitoring': {
      'Test Account': true,
      'Starter Plans': true,
      'Premier Plans': true,
    },
    'Engagement Insights': {
      'Test Account': true,
      'Starter Plans': true,
      'Premier Plans': true,
    },
    'Sending Domains': {
      'Test Account': true,
      'Starter Plans': '10',
      'Premier Plans': '50',
    },
    'Bounce Domains': {
      'Test Account': true,
      'Starter Plans': '10',
      'Premier Plans': '50',
    },
    'Tracking Domains': {
      'Test Account': true,
      'Starter Plans': '5',
      'Premier Plans': '25',
    },
    'Searchable Email Event Data': {
      'Test Account': true,
      'Starter Plans': true,
      'Premier Plans': true,
    },
    'Saved Reports': {
      conditionFlag: 'allow_saved_reports',
      'Test Account': true,
      'Starter Plans': 30,
      'Premier Plans': 100,
    },
  },
  'Advanced Settings': {
    'Scheduled Sending': {
      'Test Account': '30 days',
      'Starter Plans': '3 days',
      'Premier Plans': '30 days',
    },
    'Custom Webhooks': {
      'Test Account': true,
      'Starter Plans': '2',
      'Premier Plans': '5',
    },
    'Inbound Email Webhooks': {
      'Test Account': true,
      'Starter Plans': false,
      'Premier Plans': true,
    },
    'Real Time Alerts': {
      'Test Account': true,
      'Starter Plans': false,
      'Premier Plans': true,
    },
    'Dedicated IP Address': {
      'Test Account': false,
      'Starter Plans': false,
      'Premier Plans': '1 \n with the option to buy more',
    },
    'IP Pools': { 'Test Account': false, 'Starter Plans': false, 'Premier Plans': true },
    'Automated IP Warmup': { 'Test Account': false, 'Starter Plans': false, 'Premier Plans': true },
  },
  'Content and Recipients': {
    'Advanced Templates': { 'Test Account': true, 'Starter Plans': '10', 'Premier Plans': true },
    Snippets: { 'Test Account': true, 'Starter Plans': '10', 'Premier Plans': true },
    'Dynamic AMP Emails': { 'Test Account': true, 'Starter Plans': true, 'Premier Plans': true },
    'AB Testing': {
      'Test Account': true,
      'Starter Plans': false,
      'Premier Plans': '10',
    },
    'Recipient Lists': {
      'Test Account': true,
      'Starter Plans': '10',
      'Premier Plans': true,
    },
  },
  'Account Management and Support': {
    Subaccounts: {
      'Test Account': true,
      'Starter Plans': false,
      'Premier Plans': '15 Active',
    },
    'Online Support': {
      'Test Account': '30 days',
      'Starter Plans': true,
      'Premier Plans': true,
    },
    'Phone Support': { 'Test Account': false, 'Starter Plans': false, 'Premier Plans': true },
    'Customer support manager (CSM)': {
      'Test Account': false,
      'Starter Plans': false,
      'Premier Plans': 'Above 5M plans only',
    },
    'Single Sign-On': {
      'Test Account': true,
      'Starter Plans': false,
      'Premier Plans': true,
    },
    'Advanced Security Features': {
      'Test Account': true,
      'Starter Plans': false,
      'Premier Plans': true,
    },
  },
};

export const PLANS = ['Test Account', 'Starter Plans', 'Premier Plans'];
