/**
 * These SEGMENT_EVENTS and SEGMENT_TRAITS can be found in the Segment UI at
 * https://app.segment.com/sparkpost-daniel-chalef/protocols/tracking-plans/rs_1fgfDp0I1luTRlc3XpeQ6EpPwxx
 * as part of the protocols feature.
 */

export const SEGMENT_EVENTS = {
  ACCOUNT_CANCELLED: 'Account Cancelled',
  ACCOUNT_CREATED: 'Account Created',
  ACCOUNT_DOWNGRADED: 'Account Downgraded',
  ACCOUNT_UPGRADED: 'Account Upgraded',
  ALERT_CREATED: 'Alert Created',
  API_KEY_CREATED: 'API Key Created',
  HIBANA_TOGGLED_ON: 'Hibana Toggled On',
  HIBANA_TOGGLED_OFF: 'Hibana Toggled Off',
  INVITE_SENT: 'Invite Sent',
  SENDING_DOMAIN_ADDED: 'Sending Domain Added',
  SENDING_DOMAIN_VERIFIED: 'Sending Domain Verified',
};

const UX_EVENTS = [SEGMENT_EVENTS.HIBANA_TOGGLED_ON, SEGMENT_EVENTS.HIBANA_TOGGLED_OFF];

export const SEGMENT_TRAITS = {
  COMPANY: 'company',
  CREATED_AT: 'createdAt',
  CUSTOMER_ID: 'customer_id',
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
 * @param {} traits must include SEGMENT_TRAITS.USER_ID, SEGMENT_TRAITS.CUSTOMER_ID, and SEGMENT_TRAITS.EMAIL
 */
export const segmentIdentify = traits => {
  if (
    window.analytics &&
    window.analytics.identify &&
    traits[SEGMENT_TRAITS.CUSTOMER_ID] &&
    traits[SEGMENT_TRAITS.USER_ID] &&
    traits[SEGMENT_TRAITS.EMAIL]
  ) {
    const filteredTraits = Object.values(SEGMENT_TRAITS).reduce((filtered, key) => {
      if (traits[key]) {
        filtered[key] = traits[key];
      }
      return filtered;
    }, {});

    window.analytics.identify(
      `${filteredTraits[SEGMENT_TRAITS.EMAIL]}//${traits[SEGMENT_TRAITS.CUSTOMER_ID]}`,
      filteredTraits,
    );
  }
};

export const segmentPage = () => {
  if (window.analytics && window.analytics.page) {
    window.analytics.page();
  }
};

export const segmentTrack = (eventType, traits = {}) => {
  if (window.analytics && window.analytics.track) {
    if (UX_EVENTS.includes(eventType)) {
      window.analytics.track(eventType, { ...traits, ux: true });
    } else {
      window.analytics.track(eventType, traits);
    }
  }
};