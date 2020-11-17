import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { LINKS } from 'src/constants';

const PAGE_URL = '/dashboardV2';

describe('Version 2 of the dashboard page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    it('Shows Helpful Shortcuts "invite team members" when admin', () => {
      stubGrantsRequest({ role: 'admin' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });

      cy.visit(PAGE_URL);
      cy.wait(['@alertsReq', '@accountReq', '@usageReq']);

      cy.findByRole('heading', { name: 'Helpful Shortcuts' }).should('be.visible');

      cy.findByDataId('dashboard-helpful-shortcuts').within(() => {
        cy.findByText('Invite a Team Member')
          .closest('a')
          .should('have.attr', 'href', '/account/users/create');
        cy.findByText(
          'Need help integrating? Want to share an Analytics Report? Invite your team!',
        ).should('be.visible');

        cy.findByText('Events')
          .closest('a')
          .should('have.attr', 'href', '/reports/message-events');
        cy.findByText(
          'Robust searching capabilities with ready access to the raw event data from your emails.',
        ).should('be.visible');

        cy.findByText('Inbox Tracker')
          .closest('a')
          .should('have.attr', 'href', 'https://www.sparkpost.com/inbox-tracker/');
        cy.findByText(
          'Examine every element of deliverability with precision using Inbox Tracker.',
        ).should('be.visible');
      });
    });

    it('Shows Helpful Shortcuts "templates" when not admin', () => {
      stubGrantsRequest({ role: 'developer' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      // FORCE NOT ADMIN HERE
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.reporting.json',
        requestAlias: 'userReq',
      });

      cy.visit(PAGE_URL);
      cy.wait(['@alertsReq', '@accountReq', '@usageReq', '@userReq']);

      cy.findByRole('heading', { name: 'Helpful Shortcuts' }).should('be.visible');

      cy.findByDataId('dashboard-helpful-shortcuts').within(() => {
        cy.findByText('Templates')
          .closest('a')
          .should('have.attr', 'href', '/templates');
        cy.findByText(
          'Programmatically tailor each message with SparkPost’s flexible templates.',
        ).should('be.visible');

        cy.findByText('Events')
          .closest('a')
          .should('have.attr', 'href', '/reports/message-events');
        cy.findByText(
          'Robust searching capabilities with ready access to the raw event data from your emails.',
        ).should('be.visible');

        cy.findByText('Inbox Tracker')
          .closest('a')
          .should('have.attr', 'href', 'https://www.sparkpost.com/inbox-tracker/');

        cy.findByText(
          'Examine every element of deliverability with precision using Inbox Tracker.',
        ).should('be.visible');
      });
    });

    it('Shows add sending domain onboarding step when the user has no sending domains on their account.', () => {
      stubGrantsRequest({ role: 'developer' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' }); // would normally give them the first onboarding step, but this person doesnt have the manage grant
      stubSendingDomains({ fixture: '/200.get.no-results.json' });

      cy.visit(PAGE_URL);
      cy.wait(['@getGrants', '@alertsReq', '@accountReq', '@usageReq', '@sendingDomainsReq']);

      cy.findByRole('heading', { name: 'Get Started!' }).should('be.visible');

      cy.findAllByText('At least one').should('be.visible');
      cy.findAllByText('verified sending domain').should('be.visible');
      cy.findAllByText('is required in order to start or enable analytics.').should('be.visible');

      cy.verifyLink({
        content: 'Add Sending Domain',
        href: '/domains/list/sending',
      });

      // step 2 text...
      cy.findAllByText('Once a sending domain has been added, it needs to be').should(
        'not.be.visible',
      );

      // step 3 text...
      cy.findAllByText('Create an API key in order to start sending via API or SMTP.').should(
        'not.be.visible',
      );

      // step 4 text
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('not.be.visible');
    });

    it('Shows verify sending domain onboarding step when the user has no verified sending domains on their account. Links to the domain details page with one domain.', () => {
      stubGrantsRequest({ role: 'developer' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      stubSendingDomains({ fixture: 'sending-domains/200.get.unverified-sending.json' });

      cy.visit(PAGE_URL);
      cy.wait(['@getGrants', '@alertsReq', '@accountReq', '@usageReq', '@sendingDomainsReq']);

      cy.findByRole('heading', { name: 'Get Started!' }).should('be.visible');

      cy.findAllByText('Once a sending domain has been added, it needs to be').should('be.visible');
      cy.findAllByText('verified.').should('be.visible');
      cy.findAllByText(
        'Follow the instructions on the domain details page to configure your',
      ).should('be.visible');
      cy.findAllByText('DNS settings.').should('be.visible');

      cy.verifyLink({
        content: 'Verify Sending Domain',
        href: '/domains/details/sending-bounce/sparkspam.com',
      });

      // step 1 text...
      cy.findAllByText('is required in order to start or enable analytics.').should(
        'not.be.visible',
      );

      // step 3 text...
      cy.findAllByText('Create an API key in order to start sending via API or SMTP.').should(
        'not.be.visible',
      );

      // step 4 text
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('not.be.visible');
    });

    it('Shows verify sending domain onboarding step when the user has no verified sending domains on their account. Links to the list page with more than one domain.', () => {
      stubGrantsRequest({ role: 'developer' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      stubSendingDomains({ fixture: 'sending-domains/200.get.multiple-unverified-sending.json' });

      cy.visit(PAGE_URL);
      cy.wait(['@getGrants', '@alertsReq', '@accountReq', '@usageReq', '@sendingDomainsReq']);

      cy.findByRole('heading', { name: 'Get Started!' }).should('be.visible');

      cy.findAllByText('Once a sending domain has been added, it needs to be').should('be.visible');
      cy.findAllByText('verified.').should('be.visible');
      cy.findAllByText(
        'Follow the instructions on the domain details page to configure your',
      ).should('be.visible');
      cy.findAllByText('DNS settings.').should('be.visible');

      cy.verifyLink({
        content: 'Verify Sending Domain',
        href: '/domains/list/sending',
      });

      // step 1 text...
      cy.findAllByText('is required in order to start or enable analytics.').should(
        'not.be.visible',
      );

      // step 3 text...
      cy.findAllByText('Create an API key in order to start sending via API or SMTP.').should(
        'not.be.visible',
      );

      // step 4 text
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('not.be.visible');
    });

    it('Shows the create api key onboarding step when the user has no api keys on their account.', () => {
      stubGrantsRequest({ role: 'developer' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      stubSendingDomains({ fixture: 'sending-domains/200.get.json' });
      stubApiKeyReq({ fixture: '/200.get.no-results.json' });

      cy.visit(PAGE_URL);
      cy.wait([
        '@getGrants',
        '@alertsReq',
        '@accountReq',
        '@usageReq',
        '@sendingDomainsReq',
        '@apiKeysReq',
      ]);

      cy.findByRole('heading', { name: 'Start Sending!' }).should('be.visible');

      cy.findAllByText('Create an').should('be.visible');
      // Don't look for the abbreviate API - doesnt make much of a diff we just want to make sure the right step is displaying for the right data state.
      cy.findAllByText('key in order to start sending via API or SMTP.').should('be.visible');

      cy.verifyLink({
        content: 'Create API Key',
        href: '/account/api-keys/create',
      });

      // step 1 text...
      cy.findAllByText('is required in order to start or enable analytics.').should(
        'not.be.visible',
      );

      // step 2 text...
      cy.findAllByText('Once a sending domain has been added, it needs to be').should(
        'not.be.visible',
      );

      // step 4 text
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('not.be.visible');
    });

    it('Shows the start sending onboarding step when the user has at least one verified sending domain and at least one api key but no last usage date.', () => {
      stubGrantsRequest({ role: 'developer' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      stubSendingDomains({ fixture: 'sending-domains/200.get.json' });
      stubApiKeyReq({ fixture: 'api-keys/200.get.transmissions-modify.json' });

      cy.visit(PAGE_URL);
      cy.wait([
        '@getGrants',
        '@alertsReq',
        '@accountReq',
        '@usageReq',
        '@sendingDomainsReq',
        '@apiKeysReq',
      ]);

      cy.findByRole('heading', { name: 'Start Sending!' }).should('be.visible');
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('be.visible');

      cy.verifyLink({
        content: 'Getting Started Documentation',
        href: LINKS.ONBOARDING_SENDING_EMAIL,
      });

      // step 1 text...
      cy.findAllByText('is required in order to start or enable analytics.').should(
        'not.be.visible',
      );

      // step 2 text...
      cy.findAllByText('Once a sending domain has been added, it needs to be').should(
        'not.be.visible',
      );

      // step 3 text...
      cy.findAllByText('Create an API key in order to start sending via API or SMTP.').should(
        'not.be.visible',
      );
    });

    it('Shows the default "Go To Analytics Report" onboarding step for non-admin and non-dev users with no last usage date.', () => {
      stubGrantsRequest({ role: 'reporting' });
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      stubSendingDomains({ fixture: '/200.get.no-results.json' });
      stubApiKeyReq({ fixture: '/200.get.no-results.json' });
      // Force not admin here
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.reporting.json',
        requestAlias: 'userReq',
      });

      cy.visit(PAGE_URL);
      cy.wait([
        '@alertsReq',
        '@accountReq',
        '@usageReq',
        '@sendingDomainsReq',
        '@apiKeysReq',
        '@userReq',
      ]);

      cy.findByRole('heading', { name: 'Analytics Report' }).should('be.visible');

      cy.findByText('Build custom analytics, track engagement, diagnose errors, and more.').should(
        'be.visible',
      );

      cy.verifyLink({
        content: 'Go To Analytics Report',
        href: '/signals/analytics',
      });

      // step 1 text...
      cy.findAllByText('is required in order to start or enable analytics.').should(
        'not.be.visible',
      );

      // step 2 text...
      cy.findAllByText('Once a sending domain has been added, it needs to be').should(
        'not.be.visible',
      );

      // step 3 text...
      cy.findAllByText('Create an API key in order to start sending via API or SMTP.').should(
        'not.be.visible',
      );

      // step 4 text...
      cy.findByRole('heading', { name: 'Start Sending!' }).should('not.be.visible');
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('not.be.visible');
    });

    it('Shows the default "Go To Analytics Report" onboarding step for any user without the sending_domains/manage grant', () => {
      stubGrantsRequest({ role: 'reporting' }); // canManageSendingDomains = false
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.no-last-sent.json' });
      stubSendingDomains({ fixture: '/200.get.no-results.json' });
      stubApiKeyReq({ fixture: '/200.get.no-results.json' });

      cy.visit(PAGE_URL);
      cy.wait([
        '@getGrants',
        '@alertsReq',
        '@accountReq',
        '@usageReq',
        '@sendingDomainsReq',
        '@apiKeysReq',
      ]);

      cy.findByRole('heading', { name: 'Analytics Report' }).should('be.visible');
      cy.findByText('Build custom analytics, track engagement, diagnose errors, and more.').should(
        'be.visible',
      );

      cy.verifyLink({
        content: 'Go To Analytics Report',
        href: '/signals/analytics',
      });

      // step 1 text...
      cy.findAllByText('is required in order to start or enable analytics.').should(
        'not.be.visible',
      );

      // step 2 text...
      cy.findAllByText('Once a sending domain has been added, it needs to be').should(
        'not.be.visible',
      );

      // step 3 text...
      cy.findAllByText('Create an API key in order to start sending via API or SMTP.').should(
        'not.be.visible',
      );

      // step 4 text...
      cy.findByRole('heading', { name: 'Start Sending!' }).should('not.be.visible');
      cy.findByText(
        'Follow the Getting Started documentation to set up sending via API or SMTP.',
      ).should('not.be.visible');
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
    });

    it('does not render the "Setup Documentation" or the usage section panel when the user is not an admin, developer, or super user', () => {
      stubAlertsReq();
      stubAccountsReq();
      stubUsageReq({ fixture: 'usage/200.get.messaging.json' });
      stubSendingDomains({ fixture: 'sending-domains/200.get.json' });
      stubApiKeyReq({ fixture: 'api-keys/200.get.json' });
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.reporting.json',
        requestAlias: 'userReq',
      });
      cy.visit(PAGE_URL);
      cy.wait([
        '@accountReq',
        '@alertsReq',
        '@userReq',
        '@usageReq',
        '@sendingDomainsReq',
        '@apiKeysReq',
      ]);

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

function stubApiKeyReq({ fixture = 'alerts/200.get.json' } = {}) {
  cy.stubRequest({
    url: '/api/v1/api-keys**',
    fixture: fixture,
    requestAlias: 'apiKeysReq',
  });
}

function stubSendingDomains({ fixture = 'alerts/200.get.json' } = {}) {
  cy.stubRequest({
    url: '/api/v1/sending-domains**',
    fixture: fixture,
    requestAlias: 'sendingDomainsReq',
  });
}

function stubGrantsRequest({ role }) {
  cy.stubRequest({
    url: '/api/v1/authenticate/grants*',
    fixture: `authenticate/grants/200.get.${role}.json`,
    requestAlias: 'getGrants',
  });
}
