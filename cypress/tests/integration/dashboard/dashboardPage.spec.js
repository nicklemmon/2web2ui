const PAGE_URL = '/dashboard';

describe('The dashboard page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (Cypress.env('DEFAULT_TO_HIBANA') === true) {
    it('renders a footer with relevant external links', () => {
      cy.visit(PAGE_URL);

      // Believe it or not, this is the equivalent ARIA role for an HTML `<footer>` element
      cy.findByRole('contentinfo', { name: 'Helpful Links' }).within(() => {
        cy.verifyLink({
          content: 'System Status',
          href: 'https://status.sparkpost.com/',
        });

        cy.verifyLink({
          content: 'Documentation',
          href: 'https://www.sparkpost.com/docs',
        });

        cy.verifyLink({
          content: 'Security',
          href: 'https://www.sparkpost.com/policies/security/',
        });
      });
    });
  }
});
