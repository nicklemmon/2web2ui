import { IS_HIBANA_ENABLED } from 'cypress/constants';

const PAGE_URL = '/domains/details/fake-domain.com/verify-sending-bounce';

describe('The verify sending/bounce domain page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    describe('Verify Sending/Bounce Domain Page', () => {
      beforeEach(() => {
        cy.stubRequest({
          url: '/api/v1/account',
          fixture: 'account/200.get.json',
          requestAlias: 'accountDomainsReq',
        });
      });

      it('renders with a relevant page title', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/sending-bounce.net',
          fixture: 'sending-domains/200.get.unverified-dkim-bounce.json',
          requestAlias: 'unverifiedDkimBounce',
        });

        cy.visit('/domains/details/sending-bounce.net/verify-sending-bounce');
        cy.wait(['@accountDomainsReq', '@unverifiedDkimBounce']);

        cy.title().should('include', 'Verify Sending/Bounce Domain');
        cy.findByRole('heading', { name: 'Verify Sending/Bounce Domain' }).should('be.visible');
      });

      it('renders sections correclty in case of unverified sending/bounce domain', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/sending-bounce.net',
          fixture: 'sending-domains/200.get.unverified-dkim-bounce.json',
          requestAlias: 'unverifiedDkimBounce',
        });
        cy.stubRequest({
          method: 'POST',
          url: '/api/v1/sending-domains/sending-bounce.net/verify',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'verifyDomain',
        });

        cy.visit('/domains/details/sending-bounce.net/verify-sending-bounce');
        cy.wait(['@accountDomainsReq', '@unverifiedDkimBounce']);
        cy.findByRole('heading', { name: 'DNS Verification' }).should('be.visible');
        cy.findByRole('heading', { name: 'Add DKIM Record' }).should('be.visible');
        cy.findByRole('heading', { name: 'Add Bounce Record' }).should('be.visible');
        cy.findByRole('heading', { name: 'Add SPF Record' }).should('be.visible');
        cy.findByRole('button', { name: 'Authenticate Domain' }).should('be.visible');
      });

      it('clicking on the Authenticate Domain renders success message on succesful verification of dkim and cname of domain and renders correct section titles after', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/sending-bounce.net',
          fixture: 'sending-domains/200.get.unverified-dkim-bounce.json',
          requestAlias: 'unverifiedDkimBounce',
        });
        cy.stubRequest({
          method: 'POST',
          url: '/api/v1/sending-domains/sending-bounce.net/verify',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'verifyDomain',
        });

        cy.visit('/domains/details/sending-bounce.net/verify-sending-bounce');
        cy.wait(['@accountDomainsReq', '@unverifiedDkimBounce']);
        cy.findByLabelText('The TXT and CNAME records have been added to the DNS provider').check({
          force: true,
        });
        cy.findByRole('button', { name: 'Authenticate Domain' }).click();
        cy.wait('@verifyDomain');
        cy.findAllByText('You have successfully verified DKIM record of sending-bounce.net').should(
          'be.visible',
        );
        cy.findAllByText(
          'You have successfully verified cname record of sending-bounce.net',
        ).should('be.visible');
        cy.findByRole('heading', { name: 'TXT record for DKIM' }).should('be.visible');
        cy.findByRole('heading', { name: 'CNAME record for Bounce' }).should('be.visible');
        cy.findByRole('heading', { name: 'Add SPF Record' }).should('be.visible');
        cy.findByRole('button', { name: 'Authenticate for SPF' }).should('be.visible');
      });

      it('Authenticate Domain submit button is disabled until the user selects the confirmation checkbox', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/sending-bounce.net',
          fixture: 'sending-domains/200.get.unverified-dkim-bounce.json',
          requestAlias: 'unverifiedDkimBounce',
        });

        cy.visit('/domains/details/sending-bounce.net/verify-sending-bounce');
        cy.wait(['@accountDomainsReq', '@unverifiedDkimBounce']);

        cy.findByRole('button', { name: 'Authenticate Domain' }).should('be.visible');
        cy.findAllByText('The TXT and CNAME records have been added to the DNS provider').should(
          'be.visible',
        );
        cy.findAllByText('The TXT and CNAME records have been added to the DNS provider').should(
          'not.be.checked',
        );
        cy.findByRole('button', { name: 'Authenticate Domain' }).should('be.disabled');

        cy.findByLabelText('The TXT and CNAME records have been added to the DNS provider').check({
          force: true,
        });

        cy.findByRole('button', { name: 'Authenticate Domain' }).should('not.be.disabled');
        cy.findByRole('button', { name: 'Authenticate Domain' }).click();
      });
    });
  }

  if (!IS_HIBANA_ENABLED) {
    it('renders the 404 page when the user does not have Hibana enabled', () => {
      cy.visit(PAGE_URL);

      cy.findByRole('heading', { name: 'Page Not Found' }).should('be.visible');
    });
  }
});
