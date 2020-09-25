import { IS_HIBANA_ENABLED } from 'cypress/constants';
const BASE_UI_URL = '/domains/details';
const PAGE_URL = '/domains/details/fake-domain.com';

describe('The domains details page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    describe('The domains details page - hibana version', () => {
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

        cy.title().should('include', 'Domain Details');
        cy.findByRole('heading', { name: 'Domain Details' }).should('be.visible');
      });

      it('renders correct section for Blocked domains', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/bounce.uat.sparkspam.com',
          fixture: 'sending-domains/200.get.blocked-domain.json',
          requestAlias: 'blockedSendingDomains',
        });
        cy.visit(`${BASE_UI_URL}/bounce.uat.sparkspam.com`);
        cy.wait(['@accountDomainsReq', '@blockedSendingDomains']);

        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findAllByText('This domain has been blocked by SparkPost').should('be.visible');
      });

      it('renders correct sections for unverified domains', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/hello-world-there.com',
          fixture: 'sending-domains/200.get.unverified-dkim.json',
          requestAlias: 'unverifieddkimSendingDomains',
        });

        cy.visit(`${BASE_UI_URL}/hello-world-there.com`);
        cy.wait(['@accountDomainsReq', '@unverifieddkimSendingDomains']);

        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'DNS Verification' }).should('be.visible');
        cy.findByRole('heading', { name: 'Email Verification' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('button', { name: 'Verify Domain' }).should('be.visible');
      });

      it('renders correct sections for unverified bounce domains', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });
        cy.stubRequest({
          url: '/api/v1/sending-domains/prd2.splango.net',
          fixture: 'sending-domains/200.get.unverified-bounce.json',
          requestAlias: 'unverifiedBounceDomains',
        });
        cy.visit(`${BASE_UI_URL}/prd2.splango.net`);
        cy.wait(['@unverifiedBounceDomains', '@trackingDomainsList']);
        cy.wait('@accountDomainsReq');

        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('be.visible');
        cy.findByRole('button', { name: 'Authenticate for Bounce' }).should('be.visible');
        cy.findByRole('heading', { name: 'DNS Verification' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Email Verification' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('not.be.visible');
      });

      it('renders correct sections for unverified spf domains', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });
        cy.stubRequest({
          url: '/api/v1/sending-domains/bounce.spappteam.com',
          fixture: 'sending-domains/200.get.unverified-spf.json',
          requestAlias: 'unverifiedSpfDomains',
        });

        cy.visit(`${BASE_UI_URL}/bounce.spappteam.com`);
        cy.wait(['@unverifiedSpfDomains', '@trackingDomainsList']);
        cy.wait('@accountDomainsReq');

        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('be.visible');
        cy.findByRole('button', { name: 'Authenticate for SPF' }).should('be.visible');
        cy.findByRole('heading', { name: 'DNS Verification' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Email Verification' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('not.be.visible');
      });

      it('renders correct sections for completely verified domains', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });
        cy.stubRequest({
          url: '/api/v1/sending-domains/bounce2.spappteam.com',
          fixture: 'sending-domains/200.get.all-verified.json',
          requestAlias: 'verifiedDomains',
        });
        cy.visit(`${BASE_UI_URL}/bounce2.spappteam.com`);
        cy.wait(['@verifiedDomains', '@trackingDomainsList']);
        cy.wait('@accountDomainsReq');

        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('not.be.visible');
        cy.findByRole('button', { name: 'Authenticate for SPF' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'DNS Verification' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Email Verification' }).should('not.be.visible');
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
