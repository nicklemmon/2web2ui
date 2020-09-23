export function listSendingDomains() {
  return ['/v1/sending-domains', { method: 'GET' }];
}

export function getSendingDomain(domain) {
  return [`/v1/sending-domains/${domain}`, { method: 'GET' }];
}

export function createSendingDomain() {}

export function verifySendingDomain() {}
