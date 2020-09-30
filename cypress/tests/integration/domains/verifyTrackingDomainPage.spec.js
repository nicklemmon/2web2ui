import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/domains/details/fake-domain.com/verify-tracking';

describe('The verify tracking domain page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    describe('Verify Tracking Domain Page', () => {
      beforeEach(() => {
        cy.stubRequest({
          url: '/api/v1/account',
          fixture: 'account/200.get.has-domains-v2.json',
          requestAlias: 'accountDomainsReq',
        });
      });
      it('renders with a relevant page title when the "allow_domains_v2" account UI flag is enabled', () => {
        cy.visit(PAGE_URL);
        cy.wait('@accountDomainsReq');

        cy.title().should('include', 'Verify Tracking Domain');
        cy.findByRole('heading', { name: 'Verify Tracking Domain' }).should('be.visible');
      });
    });
  }

  if (!IS_HIBANA_ENABLED) {
    it('renders the 404 page when the user does not have Hibana enabled', () => {
      cy.visit(PAGE_URL);

      cy.findByRole('heading', { name: 'Page Not Found' }).should('be.visible');
      cy.url().should('include', '404');
    });
  }
});
