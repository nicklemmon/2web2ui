describe('The recipient validation API integration page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    // includes necessary feature flag
    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.has-standalone-recipient-validation.json',
    });

    cy.stubRequest({
      url: '/api/v1/account/countries?filter=billing',
      fixture: 'account/countries/200.get.billing-filter.json',
    });

    // for standalone recipient validation user
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.has-no-credit-card.json',
    });

    cy.stubRequest({
      url: '/api/v1/billing/subscription',
      fixture: 'billing/subscription/200.get.include-recipient-validation.json',
    });

    cy.stubRequest({
      url: '/api/v1/recipient-validation/list',
      fixture: 'recipient-validation/list/200.get.has-no-results.json',
    });

    cy.visit('/recipient-validation/api');
  });

  it('renders integration instructions and add credit card form with disabled submit button', () => {
    cy.withinMainContent(() => {
      cy.findByText('Integrate Now').should('be.visible');
      cy.findByText('/api/v1/recipient-validation/single/{address}').should('be.visible');
      cy.verifyLink({
        content: 'API Docs',
        href: 'https://developers.sparkpost.com/api/recipient-validation/',
      });
      cy.findByText('Add a Credit Card').should('be.visible');
      cy.findByRole('button', { name: 'Create API Key' }).should('be.disabled');
    });
  });

  it('adds credit card', () => {
    cy.stubRequest({
      url: '/api/v1/billing/plans',
      fixture: 'billing/plans/200.get.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/cors-data?context=create-account',
      fixture: 'billing/cors-data/200.post.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/v1/accounts',
      fixture: 'zuora/accounts/200.post.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/account/subscription/check',
      fixture: 'account/subscription/check/200.post.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/billing/subscription/check',
      fixture: 'billing/subscription/200.get.include-recipient-validation.json',
    });

    cy.findByLabelText('Credit Card Number').type('4000 0000 0000 0000');
    cy.findByLabelText('Cardholder Name').type('Brian Kemper');
    cy.findByLabelText('Expiration Date').type('01/2099');
    cy.findByLabelText('Security Code').type('123');
    cy.findByLabelText('Country').select('United States');
    cy.findByLabelText('State').select('Maryland');
    cy.findByLabelText('Zip Code').type('12345');
    cy.findByRole('button', { name: 'Create API Key' }).click();

    cy.title().should('include', 'New API Key');
  });
});
