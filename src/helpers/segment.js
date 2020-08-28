/**
 * These EVENTS and TRAITS can be found in the Segment UI at
 * https://app.segment.com/sparkpost-daniel-chalef/protocols/tracking-plans/rs_1fgfDp0I1luTRlc3XpeQ6EpPwxx
 * as part of the protocols feature.
 */

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

export const TRAITS = {
  COMPANY: 'company',
  CREATED_AT: 'createdAt',
  EMAIL: 'email',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  PLAN: 'plan',
  SERVICE_LEVEL: 'service_level',
  TENANT: 'tenant',
  USER_ID: 'user_id',
  USER_ROLE: 'user_role',
};

/**
 * Helper to identify a user, partial updates are supported but must
 * always include the username and email
 * @param {} traits must include TRAITS.USER_ID and TRAITS.EMAIL
 */
export const segmentIdentify = traits => {
  if (
    window.analytics &&
    window.analytics.identify &&
    traits[TRAITS.USER_ID] &&
    traits[TRAITS.EMAIL]
  ) {
    window.analytics.identify(`${traits[TRAITS.USER_ID]}//${traits[TRAITS.EMAIL]}`, traits);
  }
};

export const segmentPage = () => {
  if (window.analytics && window.analytics.page) {
    window.analytics.page();
  }
};
