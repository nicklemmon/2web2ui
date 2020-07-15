const PAGE_URL = '/recipient-validation/list/fake-list';

describe('The recipient validation list confirmation page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
    cy.stubRequest({
      url: '/api/v1/usage',
      fixture: 'usage/200.get.json',
    });

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

  it('renders the address count from the uploaded CSV file', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.get('[data-id="recipient-list-address-count"]').should('contain', '2');
  });

  it('renders an error when the list job returns batch status of "error"', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.error.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('Oh no! There seems to be an issue with your list...').should('be.visible');
    cy.verifyLink({
      content: 'Got It',
      href: '/recipient-validation',
    });
  });

  it('redirects to the list progress page when clicking "Validate"', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.stubRequest({
      method: 'POST',
      url: '/api/v1/recipient-validation/trigger/fake-list',
      fixture: 'recipient-validation/trigger/fake-list/200.post.json',
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

    cy.visit(PAGE_URL);

    cy.findByRole('button', { name: 'Validate' }).should('be.disabled');

    cy.findByLabelText('Credit Card Number').type('4000 0000 0000 0000');
    cy.findByLabelText('Cardholder Name').type('John Jacob');
    cy.findByLabelText('Expiration Date').type('01/2099');
    cy.findByLabelText('Security Code').type('123');
    cy.findByLabelText('Country').select('United States');
    cy.findByLabelText('State').select('Maryland');
    cy.findByLabelText('Zip Code').type('12345');

    cy.findByRole('button', { name: 'Validate' }).click();

    cy.findByText('Processing').should('be.visible');
    cy.verifyLink({
      content: 'Validate Another',
      href: '/recipient-validation',
    });
  });

  it('renders with the file name of the uploaded file', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('fake-list.csv').should('be.visible');
  });

  it('has a "How was this calculated?" link that opens a modal', () => {
    cy.stubRequest({
      url: '/api/v1/recipient-validation/job/fake-list',
      fixture: 'recipient-validation/job/fake-list/200.get.queued_for_batch.json',
    });

    cy.visit(PAGE_URL);

    cy.findByText('How was this calculated?')
      .closest('a')
      .click();

    cy.withinModal(() => {
      cy.findByText('How was this calculated?').should('be.visible');
      cy.findByText('Number of Emails').should('be.visible');
      cy.findByText('Cost').should('be.visible');
    });
  });
});
