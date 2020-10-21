import { IS_HIBANA_ENABLED } from 'cypress/constants';

const BASE_UI_URL = '/domains/details';
const PAGE_URL = `${BASE_UI_URL}/fake-domain.com`;

let trackingDomainsList = require('cypress/fixtures/tracking-domains/200.get.json');

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

      it('renders snackbar after sharing and un-sharing the domain.', () => {
        cy.stubRequest({
          method: 'PUT',
          url: '/api/v1/sending-domains/*',
          fixture: 'sending-domains/200.put.json',
          requestAlias: 'sendingDomainUpdate',
        });

        cy.visit(PAGE_URL);

        cy.wait('@accountDomainsReq');
        cy.findAllByText('Share this domain with all subaccounts').should('be.visible');
        cy.findAllByLabelText('Share this domain with all subaccounts').click({ force: true });
        cy.wait('@sendingDomainUpdate');
        cy.withinSnackbar(() => {
          cy.findAllByText('Successfully shared this domain with all subaccounts.').should(
            'be.visible',
          );
        });
        cy.findAllByLabelText('Share this domain with all subaccounts').click({ force: true });
        cy.wait('@sendingDomainUpdate');
        cy.withinSnackbar(() => {
          cy.findAllByText('Successfully un-shared this domain with all subaccounts.').should(
            'be.visible',
          );
        });
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
        cy.findByRole('heading', { name: 'Bounce' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('button', { name: 'Verify Domain' }).should('be.visible');
      });

      it('unverified domain renders success message on Verifying domain', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains/hello-world-there.com',
          fixture: 'sending-domains/200.get.unverified-dkim.json',
          requestAlias: 'unverifieddkimSendingDomains',
        });
        cy.stubRequest({
          method: 'POST',
          url: '/api/v1/sending-domains/hello-world-there.com/verify',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'verifyDomain',
        });

        cy.visit(`${BASE_UI_URL}/hello-world-there.com`);
        cy.wait(['@accountDomainsReq', '@unverifieddkimSendingDomains']);
        cy.findByRole('button', { name: 'Verify Domain' }).click();
        cy.wait('@verifyDomain');
        cy.findAllByText(
          'You have successfully verified DKIM record of hello-world-there.com',
        ).should('be.visible');
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

      it('unverified bounce domain renders success message on Verifying bounce domain', () => {
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
        cy.stubRequest({
          method: 'POST',
          url: '/api/v1/sending-domains/prd2.splango.net/verify',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'verifyDomain',
        });
        cy.visit(`${BASE_UI_URL}/prd2.splango.net`);
        cy.wait(['@unverifiedBounceDomains', '@trackingDomainsList']);
        cy.wait('@accountDomainsReq');
        cy.findByRole('button', { name: 'Authenticate for Bounce' }).should('be.disabled');
        cy.findAllByLabelText('The CNAME record has been added to the DNS provider').click({
          force: true,
        });
        cy.findByRole('button', { name: 'Authenticate for Bounce' }).should('not.be.disabled');
        cy.findByRole('button', { name: 'Authenticate for Bounce' }).click();
        cy.wait('@verifyDomain');
        cy.findAllByText('You have successfully verified cname record of prd2.splango.net').should(
          'be.visible',
        );
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

      it('renders correct sections for verified bounce domain and unverified sending domain', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });
        cy.stubRequest({
          url: '/api/v1/sending-domains/bounce2.spappteam.com',
          fixture: 'sending-domains/200.get.bounce-verified-sending-unverified.json',
          requestAlias: 'verifiedDomains',
        });
        cy.visit(`${BASE_UI_URL}/bounce2.spappteam.com`);
        cy.wait(['@verifiedDomains', '@trackingDomainsList']);
        cy.wait('@accountDomainsReq');
        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending and Bounce' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Link Tracking Domain' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('be.visible');
        cy.findByRole('button', { name: 'Verify Domain' }).should('be.visible');
        cy.findByRole('button', { name: 'Authenticate for SPF' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'DNS Verification' }).should('be.visible');
        cy.findByRole('heading', { name: 'Email Verification' }).should('be.visible');
      });

      it('delete tracking domain prompts confirmation modal first (with different verbiage)', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });

        cy.visit(`${BASE_UI_URL}/blah231231231.gmail.com`);

        cy.findByRole('button', { name: 'Delete Domain' }).click();

        cy.withinModal(() => {
          cy.findAllByText('Are you sure you want to delete this domain?').should('be.visible');

          cy.findAllByText(
            'Any templates or transmissions that use this tracking domain directly will fail.',
          ).should('be.visible');

          cy.findByRole('button', { name: 'Delete' }).should('be.visible');
          cy.findByRole('button', { name: 'Cancel' }).should('be.visible');
        });
      });

      it('delete domain prompts confirmation modal first', () => {
        cy.visit(`${BASE_UI_URL}/bounce.uat.sparkspam.com`);

        cy.findByRole('button', { name: 'Delete Domain' }).click();

        cy.withinModal(() => {
          cy.findAllByText('Are you sure you want to delete this domain?').should('be.visible');

          cy.findAllByText(
            'Any future transmission that uses this domain will be rejected.',
          ).should('be.visible');

          cy.findByRole('button', { name: 'Delete' }).should('be.visible');
          cy.findByRole('button', { name: 'Cancel' }).should('be.visible');
        });
      });

      it('confirms removal of default domain tracking.', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.json',
          requestAlias: 'trackingDomainsList',
        });

        cy.visit(`${BASE_UI_URL}/verified-and-default.com`);
        cy.wait(['@trackingDomainsList', '@accountDomainsReq']);

        cy.findByRole('heading', { name: 'Domain Details' }).should('be.visible');

        cy.findAllByLabelText('Set as Default Tracking Domain').should('be.visible');

        cy.findAllByLabelText('Set as Default Tracking Domain').should('be.checked');

        cy.findAllByLabelText('Set as Default Tracking Domain').click({ force: true });

        cy.withinModal(() => {
          cy.server();

          cy.stubRequest({
            method: 'PUT',
            url: '/api/v1/tracking-domains/verified-and-default.com',
            fixture: 'tracking-domains/200.put.json',
            requestAlias: 'trackingDomainUpdate',
          });

          cy.route({
            method: 'GET',
            url: '/api/v1/tracking-domains',
            response: {
              results: trackingDomainsList.results.map(result => {
                if (result.domain === 'verified.com') {
                  result.default = true;
                } else if (result.domain === 'verified-and-default.com') {
                  result.default = false;
                }

                return result;
              }),
            },
          }).as('updatedTrackingDomainsList');

          cy.findAllByText('Remove default tracking domain (verified-and-default.com)').should(
            'be.visible',
          );
          cy.findAllByText(
            "Transmissions and templates that don't specify a tracking domain will no longer use verified-and-default.com. Instead, they will use the system default until another default is selected.",
          ).should('be.visible');
          cy.findByRole('button', { name: 'Remove Default' }).should('be.visible');
          cy.findByRole('button', { name: 'Cancel' }).should('be.visible');

          cy.findByRole('button', { name: 'Remove Default' }).click();
          cy.wait('@trackingDomainUpdate');
        });

        cy.findAllByLabelText('Set as Default Tracking Domain').should('be.visible');
        cy.findAllByLabelText('Set as Default Tracking Domain').should('not.be.checked');
      });

      it('confirms setting a default domain tracking.', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.json',
          requestAlias: 'trackingDomainsList',
        });

        cy.visit(`${BASE_UI_URL}/verified.com`);
        cy.wait(['@trackingDomainsList', '@accountDomainsReq']);

        cy.findByRole('heading', { name: 'Domain Details' }).should('be.visible');

        cy.findAllByLabelText('Set as Default Tracking Domain').should('be.visible');
        cy.findAllByLabelText('Set as Default Tracking Domain').should('not.be.checked');

        cy.findAllByLabelText('Set as Default Tracking Domain').click({ force: true });

        cy.withinModal(() => {
          cy.server();

          cy.stubRequest({
            method: 'PUT',
            url: '/api/v1/tracking-domains/verified.com',
            fixture: 'tracking-domains/200.put.json',
            requestAlias: 'trackingDomainUpdate',
          });

          cy.route({
            method: 'GET',
            url: '/api/v1/tracking-domains',
            response: {
              results: trackingDomainsList.results.map(result => {
                if (result.domain === 'verified.com') {
                  result.default = true;
                } else if (result.domain === 'verified-and-default.com') {
                  result.default = false;
                }

                return result;
              }),
            },
          }).as('updatedTrackingDomainsList');

          cy.findAllByText('Set default tracking domain (verified.com)').should('be.visible');
          cy.findAllByText(
            "Transmissions and templates that don't specify a tracking domain will now use verified.com.",
          ).should('be.visible');
          cy.findByRole('button', { name: 'Set as Default' }).should('be.visible');
          cy.findByRole('button', { name: 'Cancel' }).should('be.visible');

          cy.findByRole('button', { name: 'Set as Default' }).click();
        });

        cy.findAllByLabelText('Set as Default Tracking Domain').should('be.visible');
        cy.findAllByLabelText('Set as Default Tracking Domain').should('be.checked');
      });

      it('on deleting a domain successfully redirects to list page', () => {
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
        cy.stubRequest({
          method: 'DELETE',
          url: '/api/v1/sending-domains/bounce2.spappteam.com',
          fixture: 'sending-domains/verify/200.post.json',
          requestAlias: 'deleteDomain',
        });
        cy.visit(`${BASE_UI_URL}/bounce2.spappteam.com`);
        cy.wait(['@verifiedDomains', '@trackingDomainsList', '@accountDomainsReq']);
        cy.findByRole('button', { name: 'Delete Domain' }).click();

        cy.withinModal(() => {
          cy.findByRole('button', { name: 'Delete' }).click();
          cy.wait('@deleteDomain');
        });

        cy.findAllByText('Domain bounce2.spappteam.com deleted.');
        cy.findByRole('heading', { name: 'Domains' }).should('be.visible');
      });

      it('renders correct section for Tracking Domains Details Section', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.domain-details.json',
          requestAlias: 'trackingDomainsList',
        });
        cy.visit(`${BASE_UI_URL}/click3.spappteam.com`);
        cy.wait(['@trackingDomainsList', '@accountDomainsReq']);
        cy.findByRole('heading', { name: 'Domain Status' }).should('be.visible');
        cy.findByRole('heading', { name: 'Tracking' }).should('be.visible');
        cy.findByRole('heading', { name: 'Delete Domain' }).should('be.visible');
        cy.findByRole('heading', { name: 'Sending' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Bounce' }).should('not.be.visible');
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
