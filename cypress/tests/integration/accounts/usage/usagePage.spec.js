const PAGE_URL = '/usage';
const BILLING_API_BASE_URL = '/api/v1/billing';

describe('The usage page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: `${BILLING_API_BASE_URL}/subscription`,
      fixture: 'billing/subscription/200.get.json',
      fixtureAlias: 'billingSubscriptionGet',
    });

    cy.stubRequest({
      url: 'api/v1/account?include=usage',
      fixture: 'account/200.get.include-usage.json',
      requestAlias: 'getAccountUsage',
    });
  });

  if (Cypress.env('DEFAULT_TO_HIBANA') === true) {
    it('renders with a relevant page title ', () => {
      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.json',
        requestAlias: 'getRVUsage',
      });

      cy.visit(PAGE_URL);
      cy.title().should('include', 'Usage');
      cy.findByRole('heading', { name: 'Usage' }).should('be.visible');
    });

    it('renders three sections when rvUsage and both products are present', () => {
      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.json',
        requestAlias: 'getRVUsage',
      });

      cy.visit(PAGE_URL);
      cy.findByText('Messaging Usage').should('be.visible');
      cy.findByText('Feature Usage').should('be.visible');
      cy.findByText('Recipient Validation Usage').should('be.visible');
    });

    it("doesn't renders recipient validation section when rvUsage is null", () => {
      cy.stubRequest({
        url: '/api/v1/usage',
        fixture: 'usage/200.get.no-results.json',
        requestAlias: 'getRVUsage',
      });

      cy.visit(PAGE_URL);
      cy.findByText('Messaging Usage').should('be.visible');
      cy.findByText('Feature Usage').should('be.visible');
      cy.findByText('Recipient Validation Usage').should('not.be.visible');
    });
  }
});
