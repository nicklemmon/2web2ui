if (Cypress.env('DEFAULT_TO_HIBANA') === true) {
  describe('the Hibana navigation', () => {
    const desktopNavSelector = '[data-id="desktop-navigation"]';
    const secondaryNavSelector = '[data-id="secondary-navigation"]';
    const mobileNavSelector = '[data-id="mobile-navigation"]';
    const accountActionlistSelector = '[data-id="desktop-navigation-account-actionlist"]';
    const accountPopoverSelector = '[data-id="desktop-navigation-account-popover"]';
    const accountPopoverTriggerSelector = '[data-id="desktop-navigation-account-popover-trigger"]';

    function commonBeforeSteps() {
      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.has-hibana-theme-controls.json',
      });

      cy.visit('/');
    }

    function stubGrantsRequest({ role }) {
      cy.stubRequest({
        url: '/api/v1/authenticate/grants*',
        fixture: `authenticate/grants/200.get.${role}.json`,
      });
    }

    beforeEach(() => {
      cy.stubAuth();
      cy.login({ isStubbed: true });
    });

    describe('desktop navigation', () => {
      beforeEach(() => {
        cy.viewport(960, 1024);
      });

      it('does not render the mobile navigation at 960px viewport width and above', () => {
        commonBeforeSteps();

        cy.get(mobileNavSelector).should('not.be.visible');
        cy.get(desktopNavSelector).should('be.visible');
      });

      it('renders all primary nav items when on the dashboard', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.verifyLink({ content: 'Signals Analytics', href: '/reports/summary' });
          cy.verifyLink({ content: 'Events', href: '/reports/message-events' });
          cy.verifyLink({ content: 'Content', href: '/templates' });
          cy.verifyLink({ content: 'Recipients', href: '/recipient-validation/list' });
          cy.verifyLink({ content: 'Inbox Placement', href: '/inbox-placement' });
          cy.verifyLink({ content: 'Blocklist', href: '/blocklist/incidents' });
        });
      });

      it('routes to the summary page and renders relevant subnav links when "Signals Analytics" is active', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Signals Analytics').click();
        });

        cy.url().should('include', '/reports/summary');

        cy.get(secondaryNavSelector).within(() => {
          cy.verifyLink({ content: 'Summary', href: '/reports/summary' });
          cy.verifyLink({ content: 'Bounce', href: '/reports/bounce' });
          cy.verifyLink({ content: 'Rejections', href: '/reports/rejections' });
          cy.verifyLink({ content: 'Accepted', href: '/reports/accepted' });
          cy.verifyLink({ content: 'Delayed', href: '/reports/delayed' });
          cy.verifyLink({ content: 'Health Score', href: '/signals/health-score' });
          cy.verifyLink({ content: 'Spam Traps', href: '/signals/spam-traps' });
          cy.verifyLink({ content: 'Engagement Recency', href: '/signals/engagement' });
        });
      });

      it('does not render the subnav when "Events" is active', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Events').click();
        });

        cy.url().should('include', '/reports/message-events');

        cy.get(secondaryNavSelector).should('not.be.visible');
      });

      it('routes to the templates page and renders relevant subnav links when "Content" is active', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Content').click();
        });

        cy.url().should('include', '/templates');

        cy.get(secondaryNavSelector).within(() => {
          cy.verifyLink({ content: 'Templates', href: '/templates' });
          cy.verifyLink({ content: 'A/B Testing', href: '/ab-testing' });
          cy.verifyLink({ content: 'Snippets', href: '/snippets' });
        });
      });

      it('routes to the recipient validation page and renders relevant subnav links when "Recipients" is active', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Recipients').click();
        });

        cy.url().should('include', '/recipient-validation/list');

        cy.get(secondaryNavSelector).within(() => {
          cy.verifyLink({ content: 'Recipient Validation', href: '/recipient-validation/list' });
          cy.verifyLink({ content: 'Recipient Lists', href: '/lists/recipient-lists' });
          cy.verifyLink({ content: 'Suppressions', href: '/lists/suppressions' });
        });
      });

      it('routes to the recipient list page when the user does not have Recipient Validation grants when navigating using the "Recipients" nav item', () => {
        cy.stubRequest({
          url: '/api/v1/authenticate/grants*',
          fixture: 'authenticate/grants/200.get.templates.json',
        });

        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Recipients').click();
        });

        cy.url().should('not.include', '/recipient-validation/list');
        cy.url().should('include', '/lists/recipient-lists');
      });

      it('renders the subnav links when subsections within the "Recipient Validation" category when a subroute is visited', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Recipients').click();
        });

        cy.findByText('Single Address').click();

        cy.get(secondaryNavSelector).within(() => {
          cy.verifyLink({ content: 'Recipient Validation', href: '/recipient-validation/list' });
          cy.verifyLink({ content: 'Recipient Lists', href: '/lists/recipient-lists' });
          cy.verifyLink({ content: 'Suppressions', href: '/lists/suppressions' });
        });
      });

      it('does not render the subnav when "Inbox Placement" is active', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Inbox Placement').click();
        });

        cy.url().should('include', '/inbox-placement');

        cy.get(secondaryNavSelector).should('not.be.visible');
      });

      it('does not render the subnav when "Blocklist" is active', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).within(() => {
          cy.findByText('Blocklist').click();
        });

        cy.url().should('include', '/blocklist/incidents');

        cy.get(secondaryNavSelector).should('not.be.visible');
      });

      it("renders the pending cancellation banner when the user's account is pending cancellation", () => {
        cy.stubAuth();

        cy.stubRequest({
          url: '/api/v1/account*',
          fixture: 'account/200.get.pending-cancellation.json',
        });

        cy.login({ isStubbed: true });
        cy.visit('/account/settings'); // Re-routing to this page successfully renders the banner

        cy.stubRequest({
          method: 'DELETE',
          url: '/api/v1/account/cancellation-request',
          fixture: 'account/cancellation-request/200.delete.json',
        });

        cy.findByText('Don’t Cancel').click();
        cy.findByText('Your account will not be cancelled.').should('be.visible');
      });
    });

    it("renders the upgrade banner when the user's account is on a free plan", () => {
      cy.stubAuth();

      cy.stubRequest({
        url: '/api/v1/account*',
        fixture: 'account/200.get.free-plan.json',
      });

      cy.login({ isStubbed: true });
      cy.visit('/');

      cy.findByText(
        'Gain access to all of the features we have to offer and increase your sending limits!',
      ).should('be.visible');
      cy.verifyLink({
        href: '/account/billing/plan',
        content: 'Upgrade Now',
      });
    });

    describe('mobile navigation', () => {
      function toggleMobileMenu() {
        // `force` required as element is exposed only to screen readers
        cy.get(mobileNavSelector).within(() => cy.findByText('Menu').click({ force: true }));
      }

      beforeEach(() => {
        cy.viewport(959, 1024);
      });

      it('does not render the desktop navigation below the 960px viewport width', () => {
        commonBeforeSteps();

        cy.get(desktopNavSelector).should('not.be.visible');

        // Can't just check for mobile nav visiblity - effective height is 0px due to use of `react-focus-lock`
        cy.get(mobileNavSelector).within(() =>
          cy
            .findByText('Menu')
            .closest('button')
            .should('be.visible'),
        );
      });

      it('renders default nav items and child items', () => {
        commonBeforeSteps();
        toggleMobileMenu();

        cy.get(mobileNavSelector).within(() => {
          cy.findByText('mockuser@example.com');
          cy.findByText('107'); // The user's Customer ID
          cy.findByText('Signals Analytics').click();
          cy.verifyLink({ content: 'Summary', href: '/reports/summary' });
          cy.verifyLink({ content: 'Bounce', href: '/reports/bounce' });
          cy.verifyLink({ content: 'Rejections', href: '/reports/rejections' });
          cy.verifyLink({ content: 'Accepted', href: '/reports/accepted' });
          cy.verifyLink({ content: 'Delayed', href: '/reports/delayed' });
          cy.verifyLink({ content: 'Health Score', href: '/signals/health-score' });
          cy.verifyLink({ content: 'Spam Traps', href: '/signals/spam-traps' });
          cy.verifyLink({ content: 'Engagement Recency', href: '/signals/engagement' });
          cy.verifyLink({ content: 'Engagement', href: '/reports/engagement' });
          cy.findByText('Signals Analytics').click();

          cy.verifyLink({ content: 'Events', href: '/reports/message-events' });

          cy.findByText('Content').click();
          cy.verifyLink({ content: 'Templates', href: '/templates' });
          cy.verifyLink({ content: 'A/B Testing', href: '/ab-testing' });
          cy.verifyLink({ content: 'Snippets', href: '/snippets' });
          cy.findByText('Content').click();

          cy.findByText('Recipients').click();
          cy.verifyLink({ content: 'Recipient Validation', href: '/recipient-validation/list' });
          cy.verifyLink({ content: 'Recipient Lists', href: '/lists/recipient-lists' });
          cy.verifyLink({ content: 'Suppressions', href: '/lists/suppressions' });
          cy.findByText('Recipients').click();

          cy.verifyLink({ content: 'Inbox Placement', href: '/inbox-placement' });
          cy.verifyLink({ content: 'Blocklist', href: '/blocklist/incidents' });

          cy.findByText('Configuration').click();
          cy.verifyLink({ content: 'Webhooks', href: '/webhooks' });
          cy.verifyLink({ content: 'IP Pools', href: '/account/ip-pools' });
          cy.verifyLink({ content: 'API Keys', href: '/account/api-keys' });
          cy.verifyLink({ content: 'SMTP Settings', href: '/account/smtp' });
          cy.verifyLink({ content: 'Sending Domains', href: '/account/sending-domains' });
          cy.verifyLink({ content: 'Tracking Domains', href: '/account/tracking-domains' });
          cy.findByText('Configuration').click();

          cy.verifyLink({ content: 'Profile', href: '/account/profile' });
          cy.verifyLink({ content: 'Alerts', href: '/alerts' });
          cy.verifyLink({ content: 'API Docs', href: 'https://developers.sparkpost.com/api' });
          cy.verifyLink({ content: 'Log Out', href: '/logout' });
        });
      });

      it('opens the help modal and closes the navigation when clicking "Help"', () => {
        commonBeforeSteps();
        toggleMobileMenu();

        cy.get(mobileNavSelector).within(() => {
          cy.findByText('Help').click();
        });

        cy.get(mobileNavSelector).should('not.be.visible');
        cy.findByText('Submit A Ticket').should('be.visible');
      });

      it('moves focus to the menu when opened', () => {
        commonBeforeSteps();
        toggleMobileMenu();

        // Grabs the `<nav>` element associated with a label via `aria-labelledby`
        cy.get(mobileNavSelector).within(() => cy.findByLabelText('Main').should('have.focus'));
      });

      it('closes when hitting the escape key', () => {
        commonBeforeSteps();
        toggleMobileMenu();

        cy.get('body').type('{esc}');

        cy.get(mobileNavSelector).within(() => {
          cy.findByLabelText('Main').should('not.be.visible');
          cy.findByText('Menu')
            .closest('button')
            .should('have.focus');
        });
      });
    });

    describe('account settings dropdown', () => {
      function toggleAccountMenu() {
        cy.findByText('Account Menu').click({ force: true });
      }

      it("renders the user's initials inside the account popover trigger", () => {
        commonBeforeSteps();

        cy.get(accountPopoverTriggerSelector).should('contain', 'UT');
      });

      it('renders an icon if no user first name and last name are returned for the current user', () => {
        cy.stubRequest({
          url: `/api/v1/users/${Cypress.env('USERNAME')}`,
          fixture: 'users/200.get.no-first-or-last-names.json',
        });

        commonBeforeSteps();

        cy.get(accountPopoverTriggerSelector).should('not.contain', 'UT');
        cy.get(accountPopoverTriggerSelector).within(() => cy.get('svg').should('be.visible'));
      });

      it('renders an icon if a first name is missing from the current user', () => {
        cy.stubRequest({
          url: `/api/v1/users/${Cypress.env('USERNAME')}`,
          fixture: 'users/200.get.no-first-name.json',
        });

        commonBeforeSteps();

        cy.get(accountPopoverTriggerSelector).should('not.contain', 'UT');
        cy.get(accountPopoverTriggerSelector).within(() => cy.get('svg').should('be.visible'));
      });

      it('renders an icon if a last name is missing from the current user', () => {
        cy.stubRequest({
          url: `/api/v1/users/${Cypress.env('USERNAME')}`,
          fixture: 'users/200.get.no-last-name.json',
        });

        commonBeforeSteps();

        cy.get(accountPopoverTriggerSelector).should('not.contain', 'UT');
        cy.get(accountPopoverTriggerSelector).within(() => cy.get('svg').should('be.visible'));
      });

      it('renders relevant account settings links when opened', () => {
        commonBeforeSteps();
        toggleAccountMenu();

        cy.get(accountActionlistSelector).within(() => {
          cy.verifyLink({ content: 'Profile', href: '/account/profile' });
          cy.verifyLink({ content: 'Account Settings', href: '/account/settings' });
          cy.verifyLink({ content: 'Billing', href: '/account/billing' });
          cy.verifyLink({ content: 'Users', href: '/account/users' });
          cy.verifyLink({ content: 'Subaccounts', href: '/account/subaccounts' });
          cy.verifyLink({ content: 'Alerts', href: '/alerts' });
          cy.verifyLink({ content: 'API Docs', href: 'https://developers.sparkpost.com/api' });
        });
      });

      it('closes the action list when a nav item is clicked', () => {
        commonBeforeSteps();
        toggleAccountMenu();

        cy.get(accountActionlistSelector).within(() => {
          cy.findByText('Profile').click();
        });

        cy.get(accountActionlistSelector).should('not.be.visible');
      });

      it('closes the action list when a nav item that triggers an action is clicked', () => {
        commonBeforeSteps();
        toggleAccountMenu();

        cy.get(accountActionlistSelector).within(() => {
          cy.findByText('Help').click();
        });

        cy.get(accountActionlistSelector).should('not.be.visible');
      });

      it('renders with relevant items as a templates user', () => {
        stubGrantsRequest({ role: 'templates' });
        commonBeforeSteps();
        toggleAccountMenu();

        cy.get(accountPopoverSelector).within(() => {
          cy.findByText('mockuser@example.com').should('be.visible');
          cy.findByText('107').should('be.visible'); // The user's Customer ID
        });

        cy.get(accountActionlistSelector).within(() => {
          cy.verifyLink({ content: 'Profile', href: '/account/profile' });
          cy.verifyLink({ content: 'Alerts', href: '/alerts' });
          cy.findByText('Help').should('be.visible');
          cy.verifyLink({ content: 'API Docs', href: 'https://developers.sparkpost.com/api' });
          cy.findByText('Log Out').should('be.visible');
        });
      });

      it('renders with relevant items as a reporting user', () => {
        stubGrantsRequest({ role: 'reporting' });
        commonBeforeSteps();
        toggleAccountMenu();

        cy.get(accountPopoverSelector).within(() => {
          cy.findByText('mockuser@example.com').should('be.visible');
          cy.findByText('107').should('be.visible'); // The user's Customer ID
        });

        cy.get(accountActionlistSelector).within(() => {
          cy.verifyLink({ content: 'Profile', href: '/account/profile' });
          cy.verifyLink({ content: 'Alerts', href: '/alerts' });
          cy.findByText('Help').should('be.visible');
          cy.verifyLink({ content: 'API Docs', href: 'https://developers.sparkpost.com/api' });
          cy.findByText('Log Out').should('be.visible');
        });
      });

      it('renders with a relevant items as a developer user', () => {
        stubGrantsRequest({ role: 'developer' });
        commonBeforeSteps();
        toggleAccountMenu();

        cy.get(accountPopoverSelector).within(() => {
          cy.findByText('mockuser@example.com').should('be.visible');
          cy.findByText('107').should('be.visible'); // The user's Customer ID
        });

        cy.get(accountActionlistSelector).within(() => {
          cy.verifyLink({ content: 'Profile', href: '/account/profile' });
          cy.verifyLink({ content: 'Subaccounts', href: '/account/subaccounts' });
          cy.verifyLink({ content: 'Alerts', href: '/alerts' });
          cy.findByText('Help').should('be.visible');
          cy.verifyLink({ content: 'API Docs', href: 'https://developers.sparkpost.com/api' });
          cy.findByText('Log Out').should('be.visible');
        });
      });

      it('renders with the "Upgrade" text when the user is on a free plan', () => {
        stubGrantsRequest({ role: 'admin' });
        cy.stubRequest({
          url: '/api/v1/account*',
          fixture: 'account/200.get.free-plan.json',
        });
        cy.visit('/');
        toggleAccountMenu();

        cy.get(accountActionlistSelector).within(() => {
          cy.findByText('Upgrade').should('be.visible');
        });
      });
    });
  });
}
