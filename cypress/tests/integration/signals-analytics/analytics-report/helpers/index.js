export function stubDeliverability(requestAlias = 'getDeliverability') {
  cy.stubRequest({
    url: '/api/v1/metrics/deliverability**/**',
    fixture: 'metrics/deliverability/200.get.json',
    requestAlias,
  });
}

export function stubTimeSeries(requestAlias = 'getTimeSeries') {
  cy.stubRequest({
    url: '/api/v1/metrics/deliverability/time-series**/**',
    fixture: 'metrics/deliverability/time-series/200.get.json',
    requestAlias,
  });
}

export function stubSubaccounts(requestAlias = 'getSubaccounts') {
  cy.stubRequest({
    url: '/api/v1/subaccounts',
    fixture: 'subaccounts/200.get.json',
    requestAlias,
  });
}

export function commonBeforeSteps() {
  cy.stubAuth();
  cy.login({ isStubbed: true });

  stubSubaccounts();
  stubDeliverability();
  stubTimeSeries();
}
