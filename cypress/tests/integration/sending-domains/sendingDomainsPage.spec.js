describe('Sending Domains page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('handles an empty sending domain response without crashing', () => {
    cy.stubRequest({
      url: '/api/v1/sending-domains',
      fixture: 'sending-domains/200.get.json',
      requestAlias: 'getSendingDomains',
    });

    cy.visit('/account/sending-domains');

    cy.wait('@getSendingDomains');

    cy.stubRequest({
      url: '/api/v1/tracking-domains',
      fixture: 'tracking-domains/200.get.json',
      delay: 5000,
    });

    cy.stubRequest({
      url: '/api/v1/sending-domains/bounce.uat.sparkspam.com',
      fixture: 'blank.json',
    });

    cy.findByText('bounce.uat.sparkspam.com').click();
    cy.withinMainContent(() => cy.findByText('Sending Domains').click());
  });
});
