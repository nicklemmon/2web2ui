describe('The recipient validation /single route', () => {
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
  });

  it('has a relevant page title', () => {
    cy.visit('/recipient-validation/single');
    cy.title().should('include', 'Recipient Validation');
  });

  it('has a relevant heading', () => {
    cy.visit('/recipient-validation/single');

    cy.findByText('Validate a Single Address').should('be.visible');
  });

  it('renders a "required" field level error when skipping entering an email address', () => {
    cy.visit('/recipient-validation/single');

    cy.findByLabelText('Email Address')
      .focus()
      .blur();

    cy.findByText('Required').should('be.visible');
  });

  it('renders an "Invalid Email" error when the user enters an invalid email address', () => {
    cy.visit('/recipient-validation/single');

    cy.findByLabelText('Email Address')
      .type('hello')
      .blur();

    cy.findByText('Invalid Email').should('be.visible');
  });

  it('re-directs the user to the single address validation results page when the user enters a single email address for validation', () => {
    const fakeEmail = 'fake-email@sparkpost.com';

    cy.stubRequest({
      method: 'GET',
      url: `/api/v1/recipient-validation/single/${fakeEmail}`,
      fixture: 'recipient-validation/single/fake-email/200.get.valid-result.json',
    });

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

    cy.visit('/recipient-validation/single');

    cy.findByText('Add a Credit Card').should('be.visible');
    cy.findByRole('button', { name: 'Validate' }).should('be.disabled');

    cy.findByLabelText('Email Address').type(fakeEmail);
    cy.findByLabelText('Credit Card Number').type('4000 0000 0000 0000');
    cy.findByLabelText('Cardholder Name').type('John Jacob');
    cy.findByLabelText('Expiration Date').type('01/2099');
    cy.findByLabelText('Security Code').type('123');
    cy.findByLabelText('Country').select('United States');
    cy.findByLabelText('State').select('Maryland');
    cy.findByLabelText('Zip Code').type('12345');

    cy.findByRole('button', { name: 'Validate' }).click();
    cy.title().should('include', 'Results | Recipient Validation');
  });
});
