import { IS_HIBANA_ENABLED } from 'cypress/constants';

describe('logging out', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.visit('/');
    cy.login({ isStubbed: true });
  });

  it('logs out the user and prevents re-entry in to the app', () => {
    cy.server();
    cy.fixture('/authenticate/logout/200.post.json').as('logoutPost');
    cy.route({
      method: 'POST',
      url: '/api/v1/authenticate/logout',
      response: '@logoutPost',
      status: 200,
    });

    if (IS_HIBANA_ENABLED) {
      cy.findByText('UT').click();
      cy.get('[data-id="desktop-navigation-account-actionlist"]').within(() => {
        cy.findByRole('link', { name: 'Log Out' }).click();
      });
    } else {
      cy.findByText('mockuser@example.com').click();
      cy.findByText('Log Out').click();
    }

    cy.url().should('include', '/auth');
    cy.visit('/dashboard');
    cy.url().should('include', '/auth');
  });
});
