export function getAccount(params) {
  return {
    method: 'GET',
    url: '/v1/account',
    params,
  };
}

export function getUsage() {
  return {
    method: 'GET',
    url: '/v1/usage',
  };
}
