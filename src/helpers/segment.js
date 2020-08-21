export const EVENTS = {
  ACCOUNT_CANCELLED: 'Account Cancelled',
  ACCOUNT_CREATED: 'Account Created',
  ACCOUNT_DOWNGRADED: 'Account Downgraded',
  ACCOUNT_UPGRADED: 'Account Upgraded',
  ALERT_CREATED: 'Alert Created',
  API_KEY_CREATED: 'API Key Created',
  INVITE_SENT: 'Invite Sent',
  SENDING_DOMAIN_VERIFIED: 'Sending Domain Verified',
};

export const segmentIdentify = () => {
  if (window.analytics && window.analytics.identify) {
    window.analytics.identify();
  }
};

export const segmentPage = () => {
  if (window.analytics && window.analytics.page) {
    window.analytics.page();
  }
};
