import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { LINKS } from 'src/constants';

const PAGE_URL = '/dashboardV2';

describe('Version 2 of the dashboard page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    it('onboarding step one', () => {
      stubAccountsReq({ fixture: 'account/200.get.has-dashboard-v2.json' });
      stubUsageReq({ fixture: 'usage/200.get.no-last-sent.json' });
      cy.stubRequest({
        url: '/api/v1/sending-domains**',
        fixture: 'sending-domains/200.get.no-results.json',
        requestAlias: 'sendingDomains',
      });
      cy.visit(PAGE_URL);
      cy.wait(['@accountReq', '@usageReq', '@sendingDomains']);

      cy.title().should('include', 'Dashboard');

      cy.findByRole('heading', { name: 'Get Started!' }).should('be.visible');

      cy.findAllByText('At least one').should('be.visible');
      cy.findAllByText('verified sending domain').should('be.visible');
      cy.findAllByText('is required in order to start or enable analytics.').should('be.visible');

      cy.get('a')
        .contains('Add Sending Domain')
        .should('be.visible')
        .should('not.be.disabled');
    });

    it.skip('onboarding step two', () => {
      // TODO: FE-1211, FE-1213
    });

    it.skip('onboarding step three', () => {
      // TODO: FE-1213, FE-1213
    });

    it('onboarding step four', () => {
      stubAccountsReq({ fixture: 'account/200.get.has-dashboard-v2.json' });
      stubUsageReq({ fixture: 'usage/200.get.no-last-sent.json' });
      stubAlertsReq({ fixture: 'alerts/200.get.json' });

      cy.visit(PAGE_URL);
      cy.wait(['@accountReq', '@alertsReq', '@usageReq']);

      cy.title().should('include', 'Dashboard');

      cy.findByRole('heading', { name: 'Start Sending!' }).should('be.visible');
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('be.visible');

      cy.get('a')
        .contains('Getting Started Documentation')
        .should('be.visible')
        .should('not.be.disabled');
    });

    it('renders with a relevant page title, relevant headings, and links when the `allow_dashboard_v2` account flag is enabled', () => {
      commonBeforeSteps();
      cy.title().should('include', 'Dashboard');
      cy.findByRole('heading', { name: 'Welcome, Ulysses!' }).should('be.visible');

      cy.findByRole('heading', { name: 'Setup Documentation' }).should('be.visible');
      cy.verifyLink({
        content: 'Integration Documentation',
        href: '/',
      });

      cy.findByRole('heading', { name: 'Need Help?' }).should('be.visible');
      cy.findByRole('button', { name: 'Contact our Support Team' }).click();
      cy.withinModal(() => cy.findByRole('button', { name: 'Close' }).click());

      cy.findByRole('heading', { name: 'Next Steps' }).should('exist'); // Screen reader only heading
      cy.verifyLink({
        content: 'Getting Started Documentation',
        href: LINKS.ONBOARDING_SENDING_EMAIL,
      });
    });

    // TODO: Fix, something is wrong here
    it.skip('does not render certain links when grants are not available for a user', () => {
      commonBeforeSteps();
      cy.stubRequest({
        url: '/api/v1/authenticate/grants*',
        fixture: 'authenticate/grants/200.get.reporting.json',
        requestAlias: 'getGrants',
      });
      cy.visit(PAGE_URL);
      cy.wait('@getGrants');

      // TODO: Fix assertions here based on new onboarding flow
      // The user cannot manage sending domains
      // cy.findByRole('link', { name: 'Add a Sending Domain' }).should('not.be.visible');

      // The user cannot manage API keys
      // cy.findByRole('link', { name: 'Generate an API Key' }).should('not.be.visible');

      // The user cannot manage the account
      // cy.findByRole('link', { name: 'Upgrade' }).should('not.be.visible');

      // Some links always render
      // cy.verifyLink({
      //   content: 'Analyze your Data',
      //   href: '/signals/analytics',
      // });
      // cy.verifyLink({
      //   content: 'Create an Alert',
      //   href: '/alerts/create',
      // });
    });

    // TODO: Fix, something is wrong here
    it.skip('does not render the "Setup Documentation" or the usage section panel when the user is not an admin, developer, or super user', () => {
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.reporting.json',
        requestAlias: 'userReq',
      });
      stubAccountsReq();
      stubAlertsReq();
      cy.visit(PAGE_URL);
      cy.wait(['@accountReq', '@alertsReq', '@userReq']);

      cy.findByRole('heading', { name: 'Setup Documentation' }).should('not.be.visible');
      cy.findByRole('heading', { name: 'Need Help?' }).should('be.visible');
      cy.findByDataId('transmissions-usage-section').should('not.be.visible');
      cy.findByDataId('validations-usage-section').should('not.be.visible');
    });

    it('renders the 404 page if the user has Hibana enabled but does not have the `allow_dashboard_v2` account flag', () => {
      cy.visit(PAGE_URL);

      cy.findByRole('heading', { name: 'Page Not Found' }).should('be.visible');
      cy.url().should('include', '404');
    });

    describe('sidebar', () => {
      it("renders the user's email address and role  in the account details section", () => {
        commonBeforeSteps();

        cy.findByDataId('sidebar-account-details').within(() => {
          cy.findByRole('heading', { name: 'Profile' }).should('be.visible');
          cy.findByText('mockuser@example.com').should('be.visible');
          cy.findByText('Admin').should('be.visible');
        });
      });

      it("renders the user's billing data within the billing and usage section", () => {
        commonBeforeSteps();

        cy.findByDataId('sidebar-billing-usage-detail').within(() => {
          cy.findByRole('heading', { name: 'Billing/Usage Detail' }).should('be.visible');
          cy.findByRole('heading', { name: 'Sending Plan' }).should('be.visible');
          cy.findByText('Custom Monthly Starter Plan').should('be.visible');
          cy.findByDataId('sidebar-transmissions-this-month').should('contain', '7,968,145');
          cy.findByDataId('sidebar-transmissions-in-plan').should('contain', '15,000,000');
          cy.findByDataId('sidebar-validations-this-month').should('contain', '50');
          cy.verifyLink({
            content: 'Upgrade',
            href: '/account/billing/plan',
          });
          cy.findByDataId('sidebar-validations-end-of-billing-period').should(
            'contain',
            'Aug 11, 2020',
          );
          cy.verifyLink({
            content: 'View Usage Numbers',
            href: '/usage',
          });
        });
      });

      it('renders recent, non-muted alerts', () => {
        commonBeforeSteps();

        cy.findByDataId('sidebar-recent-alerts').within(() => {
          cy.verifyLink({
            content: 'Alert 2',
            href: '/alerts/details/2',
          });
          cy.findByText('Jul 10, 2019').should('be.visible');
          cy.findByText('Soft Bounce Rate').should('be.visible');

          cy.verifyLink({
            content: 'Alert 3',
            href: '/alerts/details/3',
          });
          cy.findByText('Jul 9, 2019').should('be.visible');
          cy.findByText('Block Bounce Rate').should('be.visible');
        });
      });

      it('does not render the billing period if the user is on an annual plan', () => {
        stubAccountsReq({ fixture: 'account/200.get.annual-plan.json' });
        stubUsageReq();
        stubAlertsReq();

        cy.visit(PAGE_URL);

        cy.wait(['@accountReq', '@usageReq', '@alertsReq']);

        cy.findByText('Your billing period ends').should('not.be.visible');
      });

      it('does not render subsections when no data are returned', () => {
        stubAccountsReq();
        stubUsageReq({ fixture: '200.get.no-results.json' });
        stubAlertsReq({ fixture: '200.get.no-results.json' });

        cy.visit(PAGE_URL);

        cy.wait(['@accountReq', '@usageReq', '@alertsReq']);

        cy.findByRole('heading', { name: 'Recipient Validation' }).should('not.be.visible');
        cy.findByRole('heading', { name: 'Recent Alerts' }).should('not.be.visible');
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

function commonBeforeSteps() {
  stubAccountsReq();
  stubUsageReq();
  stubAlertsReq();

  cy.visit(PAGE_URL);
  cy.wait(['@accountReq', '@usageReq', '@alertsReq']);
}

function stubAccountsReq({ fixture = 'account/200.get.has-dashboard-v2.json' } = {}) {
  cy.stubRequest({
    url: '/api/v1/account**',
    fixture: fixture,
    requestAlias: 'accountReq',
  });
}

function stubUsageReq({ fixture = 'usage/200.get.json' } = {}) {
  cy.stubRequest({
    url: '/api/v1/usage',
    fixture: fixture,
    requestAlias: 'usageReq',
  });
}

function stubAlertsReq({ fixture = 'alerts/200.get.json' } = {}) {
  cy.stubRequest({
    url: '/api/v1/alerts',
    fixture: fixture,
    requestAlias: 'alertsReq',
  });
}
