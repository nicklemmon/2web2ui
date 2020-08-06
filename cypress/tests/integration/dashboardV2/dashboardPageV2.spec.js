const PAGE_URL = '/dashboardV2';

describe('Version 2 of the dashboard page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (Cypress.env('DEFAULT_TO_HIBANA') === true) {
    it('renders with a relevant page title and relevant headings when the `allow_dashboard_v2` account flag is enabled', () => {
      cy.stubRequest({
        url: '/api/v1/account',
        fixture: 'account/200.get.has-dashboard-v2.json',
        requestAlias: 'accountDashboardV2Req',
      });
      cy.visit(PAGE_URL);
      cy.wait('@accountDashboardV2Req');

      cy.title().should('include', 'Dashboard');
      cy.findByRole('heading', { name: 'Welcome, Ulysses!' }).should('be.visible');
      cy.findByRole('heading', { name: 'Setup Documentation' }).should('be.visible');
      cy.findByRole('heading', { name: 'Need Help?' }).should('be.visible');
      cy.findByRole('heading', { name: 'Helpful Shortcuts' }).should('be.visible');
      cy.findByRole('heading', { name: 'Account Details' }).should('be.visible');
      cy.findByRole('heading', { name: 'Billing/Usage Detail' }).should('be.visible');
    });

    it('renders the 404 page if the user has Hibana enabled but does not have the `allow_dashboard_v2` account flag', () => {
      cy.visit(PAGE_URL);

      cy.findByRole('heading', { name: 'Page Not Found' }).should('be.visible');
      cy.url().should('include', '404');
    });
  }

  if (Cypress.env('DEFAULT_TO_HIBANA') !== true) {
    it('renders the 404 page when the user does not have Hibana enabled', () => {
      cy.visit(PAGE_URL);

      cy.findByRole('heading', { name: 'Page Not Found' }).should('be.visible');
      cy.url().should('include', '404');
    });
  }
});
