export const BASE_URL = '/domains';
export const SENDING_DOMAINS_URL = `${BASE_URL}/list/sending`;
export const BOUNCE_DOMAINS_URL = `${BASE_URL}/list/bounce`;
export const TRACKING_DOMAINS_URL = `${BASE_URL}/list/tracking`;
export const DETAILS_BASE_URL = `${BASE_URL}/details`;
export const API_ERROR_MESSAGE = 'Sorry, we seem to have had some trouble loading your domains.';
export const EXTERNAL_LINKS = {
  VERIFY_SENDING_DOMAIN_OWNERSHIP:
    'https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#sending-domain-step-2-verifying-domain-ownership',
  SENDING_DOMAINS_API_DOCUMENTATION: 'https://developers.sparkpost.com/api/sending-domains/',
  SENDING_DOMAINS_DOCUMENTATION:
    'https://www.sparkpost.com/docs/getting-started/requirements-for-sending-domains/',
  BOUNCE_DOMAIN_DOCUMENTATION:
    'https://www.sparkpost.com/docs/tech-resources/custom-bounce-domain/',
  TRACKING_DOMAIN_DOCUMENTATION:
    'https://www.sparkpost.com/docs/tech-resources/enabling-multiple-custom-tracking-domains/',
};
