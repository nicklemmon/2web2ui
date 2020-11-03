export function getBilling(params) {
  return {
    method: 'GET',
    url: '/v1/billing',
    params,
  };
}

export function getSubscription(params) {
  return {
    method: 'GET',
    url: '/v1/billing/subscription',
    params,
  };
}
