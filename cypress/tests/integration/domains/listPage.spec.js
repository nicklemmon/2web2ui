import { IS_HIBANA_ENABLED } from 'cypress/constants';

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

  if (IS_HIBANA_ENABLED) {
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

      cy.findByRole('tab', { name: 'Bounce Domains' })
        .click()
        .should('have.attr', 'aria-selected', 'true');
      cy.url().should('include', `${PAGE_URL}/list/bounce`);

      cy.findByRole('tab', { name: 'Sending Domains' })
        .click()
        .should('have.attr', 'aria-selected', 'true');
      cy.url().should('include', `${PAGE_URL}/list/sending`);
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

    describe('sending domains table', () => {
      function verifyTableRow({ rowIndex, domainName, creationDate, subaccount, statusTags }) {
        cy.get('tbody tr')
          .eq(rowIndex)
          .within(() => {
            cy.get('td')
              .eq(0)
              .within(() => {
                cy.verifyLink({
                  content: domainName,
                  href: `/domains/details/${domainName}`,
                });

                if (creationDate) cy.findByText(creationDate).should('be.visible');

                if (subaccount) cy.findByText(subaccount).should('be.visible');
              });

            cy.get('td')
              .eq(1)
              .within(() => {
                statusTags.forEach(tag => cy.findByText(tag).should('be.visible'));
              });
          });

        // Return the row to allow `.within()` chaining
        return cy.get('tbody tr').eq(rowIndex);
      }

      it('renders a table after requesting sending domains', () => {
        stubSendingDomains({ fixture: 'sending-domains/200.get.multiple-results.json' });
        stubSubaccounts();
        cy.visit(PAGE_URL);
        cy.wait(['@sendingDomainsReq', '@subaccountsReq']);

        cy.findByRole('table').should('be.visible');

        verifyTableRow({
          rowIndex: 0,
          domainName: 'default-bounce.com',
          creationDate: 'Aug 3, 2017',
          statusTags: ['Sending', 'Bounce'],
        }).within(() => {
          cy.findByDataId('default-bounce-domain-tooltip').click();
        });

        cy.findAllByText('Default Bounce Domain').should('be.visible');

        verifyTableRow({
          rowIndex: 1,
          domainName: 'ready-for-sending.com',
          creationDate: 'Aug 3, 2017',
          statusTags: ['Sending'],
        });

        verifyTableRow({
          rowIndex: 2,
          domainName: 'failed-verification.com',
          creationDate: 'Aug 3, 2017',
          statusTags: ['Failed Verification'],
        });

        verifyTableRow({
          rowIndex: 3,
          domainName: 'dkim-signing.com',
          creationDate: 'Aug 3, 2017',
          statusTags: ['Sending', 'DKIM Signing'],
        });

        verifyTableRow({
          rowIndex: 4,
          domainName: 'spf-valid.com',
          creationDate: 'Aug 3, 2017',
          statusTags: ['SPF Valid'],
        });

        verifyTableRow({
          rowIndex: 5,
          domainName: 'blocked.com',
          creationDate: 'Aug 3, 2017',
          statusTags: ['Blocked'],
        });

        verifyTableRow({
          rowIndex: 6,
          domainName: 'with-a-subaccount.com',
          creationDate: 'Aug 3, 2017',
          subaccount: 'Fake...unt 1 (101)',
          statusTags: ['Failed Verification'],
        });
      });

      it('renders an empty state when no results are returned', () => {
        cy.stubRequest({
          url: '/api/v1/sending-domains',
          fixture: '200.get.no-results.json',
          requestAlias: 'sendingDomainsReq',
        });
        cy.visit(PAGE_URL);
        cy.wait('@sendingDomainsReq');

        cy.withinMainContent(() => {
          cy.findByRole('table').should('not.be.visible');
          cy.findByText('There is no data to display').should('be.visible');
        });
      });

      it('renders an error message when an error is returned from the server', () => {
        stubSendingDomains({ fixture: '400.json', statusCode: 400 });
        cy.visit(PAGE_URL);
        cy.wait('@sendingDomainsReq');

        cy.withinSnackbar(() => {
          cy.findByText('Something went wrong.').should('be.visible');
        });

        cy.withinMainContent(() => {
          cy.findByRole('heading', { name: 'An error occurred' }).should('be.visible');
          cy.findByText('Sorry, we seem to have had some trouble loading your domains.').should(
            'be.visible',
          );
          cy.findByRole('button', { name: 'Show Error Details' }).click();
          cy.findByText('This is an error').should('be.visible');
          cy.findByRole('button', { name: 'Hide Error Details' }).click();
          cy.findByText('This is an error').should('not.be.visible');
        });

        // Verifying that the list endpoint is re-requested, rendering the table successfully
        stubSendingDomains();
        cy.findByRole('button', { name: 'Try Again' }).click();
        cy.wait('@sendingDomainsReq');

        cy.findByRole('table').should('be.visible');
      });
    });

    describe('bounce domains table', () => {
      it('renders a table after requesting sending domains - and renders only bounce domains', () => {
        stubSendingDomains({ fixture: 'sending-domains/200.get.multiple-results.json' });
        stubSubaccounts();
        cy.visit(`${PAGE_URL}/list/bounce`);
        cy.wait(['@sendingDomainsReq', '@subaccountsReq']);

        cy.get('tbody tr')
          .eq(0)
          .within(() => {
            cy.get('td')
              .eq(0)
              .within(() => {
                cy.verifyLink({
                  content: 'default-bounce.com',
                  href: `${PAGE_URL}/details/default-bounce.com`,
                });
                cy.findByText('Aug 3, 2017');
              });
            cy.get('td')
              .eq(1)
              .within(() => {
                cy.findByText('Sending').should('be.visible');
                cy.findByText('Bounce').should('be.visible');
              });
          });
      });

      it('renders an empty state when no results are returned', () => {
        stubSendingDomains({ fixture: '200.get.no-results.json' });
        stubSubaccounts();
        cy.visit(`${PAGE_URL}/list/bounce`);
        cy.wait(['@sendingDomainsReq', '@subaccountsReq']);

        cy.get('table').should('not.be.visible');
        cy.findByText('There is no data to display').should('be.visible');
      });

      it('renders an error message when an error is returned from the server', () => {
        stubSendingDomains({ fixture: '400.json', statusCode: 400 });
        cy.visit(`${PAGE_URL}/list/bounce`);
        cy.wait('@sendingDomainsReq');

        cy.withinSnackbar(() => {
          cy.findByText('Something went wrong.').should('be.visible');
        });

        cy.withinMainContent(() => {
          cy.findByRole('heading', { name: 'An error occurred' }).should('be.visible');
          cy.findByText('Sorry, we seem to have had some trouble loading your domains.').should(
            'be.visible',
          );
          cy.findByRole('button', { name: 'Show Error Details' }).click();
          cy.findByText('This is an error').should('be.visible');
          cy.findByRole('button', { name: 'Hide Error Details' }).click();
          cy.findByText('This is an error').should('not.be.visible');
        });

        // Verifying that the list endpoint is re-requested, rendering the table successfully
        stubSendingDomains();
        cy.findByRole('button', { name: 'Try Again' }).click();
        cy.wait('@sendingDomainsReq');

        cy.findByRole('table').should('be.visible');
      });
    });

    describe('tracking domains table', () => {
      function verifyTableRow({ rowIndex, domainName, subaccount, status }) {
        cy.get('tbody tr')
          .eq(rowIndex)
          .within(() => {
            cy.get('td')
              .eq(0)
              .within(() => {
                cy.verifyLink({
                  content: domainName,
                  href: `/domains/details/${domainName}`,
                });

                if (subaccount) cy.findByText(subaccount).should('be.visible');
              });

            cy.get('td')
              .eq(1)
              .within(() => {
                cy.findByText(status).should('be.visible');
              });
          });

        // Return the row to allow `.within()` chaining
        return cy.get('tbody tr').eq(rowIndex);
      }

      it('renders requested tracking domains data in a table', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.json',
          requestAlias: 'trackingDomainsReq',
        });
        stubSubaccounts();
        cy.visit(`${PAGE_URL}/list/tracking`);
        cy.wait(['@trackingDomainsReq', '@subaccountsReq']);

        verifyTableRow({
          rowIndex: 0,
          domainName: 'unverified.com',
          status: 'Failed Verification',
        });

        verifyTableRow({
          rowIndex: 1,
          domainName: 'verified.com',
          status: 'Tracking',
        });

        verifyTableRow({
          rowIndex: 2,
          domainName: 'verified-and-default.com',
          status: 'Tracking',
        }).within(() => {
          cy.findByDataId('default-tracking-domain-tooltip').click();
        });
        cy.findAllByText('Default Tracking Domain').should('be.visible');

        verifyTableRow({
          rowIndex: 3,
          domainName: 'blocked.com',
          status: 'Blocked',
        });

        verifyTableRow({
          rowIndex: 4,
          domainName: 'with-subaccount-assignment.com',
          status: 'Tracking',
          subaccount: 'Subaccount 101',
        });
      });

      it('renders an empty state when no results are returned', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: '200.get.no-results.json',
          requestAlias: 'trackingDomainsReq',
        });
        cy.visit(`${PAGE_URL}/list/tracking`);
        cy.wait('@trackingDomainsReq');

        cy.withinMainContent(() => {
          cy.findByRole('table').should('not.be.visible');
          cy.findByText('There is no data to display').should('be.visible');
        });
      });

      it('renders an error message when an error is returned from the server', () => {
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: '400.json',
          statusCode: 400,
          requestAlias: 'trackingDomainsReq',
        });
        cy.visit(`${PAGE_URL}/list/tracking`);
        cy.wait('@trackingDomainsReq');

        cy.withinMainContent(() => {
          cy.findByRole('heading', { name: 'An error occurred' }).should('be.visible');
          cy.findByText('Sorry, we seem to have had some trouble loading your domains.').should(
            'be.visible',
          );
        });

        // Verifying that the list endpoint is re-requested, rendering the table successfully
        cy.stubRequest({
          url: '/api/v1/tracking-domains',
          fixture: 'tracking-domains/200.get.json',
          requestAlias: 'trackingDomainsReq',
        });
        cy.findByRole('button', { name: 'Try Again' }).click();
        cy.wait('@trackingDomainsReq');
        cy.findByRole('table').should('be.visible');
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

function stubSendingDomains({
  fixture = 'sending-domains/200.get.json',
  requestAlias = 'sendingDomainsReq',
  statusCode = 200,
} = {}) {
  cy.stubRequest({
    url: '/api/v1/sending-domains',
    fixture,
    requestAlias,
    statusCode,
  });
}

function stubSubaccounts({
  fixture = 'subaccounts/200.get.json',
  requestAlias = 'subaccountsReq',
} = {}) {
  cy.stubRequest({
    url: '/api/v1/subaccounts',
    fixture,
    requestAlias,
  });
}
