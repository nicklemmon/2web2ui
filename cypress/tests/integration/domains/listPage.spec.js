const PAGE_URL = '/domains';

describe('The domains list page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    cy.stubRequest({
      url: '/api/v1/account',
      fixture: 'account/200.get.has-domains-v2.json',
      requestAlias: 'accountDomainsReq',
    });
  });

  if (Cypress.env('DEFAULT_TO_HIBANA') === true) {
    it('renders with a relevant page title when the "allow_domains_v2" account UI flag is enabled and redirects to the sending domain view', () => {
      cy.visit(PAGE_URL);

      cy.wait('@accountDomainsReq');

      cy.title().should('include', 'Domains');
      cy.findByRole('heading', { name: 'Domains' }).should('be.visible');
      cy.url().should('include', `${PAGE_URL}/list/sending`);
    });

    it('renders with a link to the domains create page', () => {
      cy.visit(PAGE_URL);

      cy.wait('@accountDomainsReq');

      cy.verifyLink({
        content: 'Add a Domain',
        href: '/domains/create',
      });
    });

    it('renders tabs that route to different sending/bounce/tracking domain views when clicked', () => {
      cy.visit(PAGE_URL);

      cy.wait('@accountDomainsReq');

      // Going right to left since the first tab is already active!
      cy.findByRole('tab', { name: 'Tracking Domains' })
        .click()
        .should('have.attr', 'aria-selected', 'true');
      cy.url().should('include', `${PAGE_URL}/list/tracking`);
      cy.findByRole('tabpanel').within(() => {
        cy.findByText('Tracking domains table goes here').should('be.visible');
      });

      cy.findByRole('tab', { name: 'Bounce Domains' })
        .click()
        .should('have.attr', 'aria-selected', 'true');
      cy.url().should('include', `${PAGE_URL}/list/bounce`);
      cy.findByRole('tabpanel').within(() => {
        cy.findByText('Bounce domains table goes here').should('be.visible');
      });

      cy.findByRole('tab', { name: 'Sending Domains' })
        .click()
        .should('have.attr', 'aria-selected', 'true');
      cy.url().should('include', `${PAGE_URL}/list/sending`);
      cy.findByRole('tabpanel').within(() => {
        cy.findByText('Sending domains table goes here').should('be.visible');
      });
    });

    describe('the filtering UI', () => {
      it('renders with a "Filter Domains" text field', () => {
        cy.visit(PAGE_URL);

        cy.wait('@accountDomainsReq');

        cy.findByLabelText('Filter Domains').should('be.visible');
      });

      it('renders with a "Domain Status" button that renders a popover when clicked', () => {
        cy.visit(PAGE_URL);

        cy.wait('@accountDomainsReq');

        cy.findByRole('button', { name: 'Domain Status' }).click();
        cy.findByRole('checkbox', { name: 'Select All' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'Sending Domain' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'DKIM Signing' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'Bounce' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'SPF Valid' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'DMARC Compliant' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'Pending Verification' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'Failed Verification' }).should('be.visible');
        cy.findByRole('checkbox', { name: 'Blocked' }).should('be.visible');
        cy.findByRole('button', { name: 'Apply' }).should('be.visible');
      });
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
