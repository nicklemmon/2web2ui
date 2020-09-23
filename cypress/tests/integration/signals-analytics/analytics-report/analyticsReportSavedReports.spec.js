import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL } from './constants';
import { commonBeforeSteps } from './helpers';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report Saved Reports', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.metrics-rollup-and-saved-reports.json',
      });

      cy.stubRequest({
        url: '/api/v1/reports',
        fixture: '200.get.no-results',
      });

      cy.stubRequest({
        url: '/api/v1/billing/subscription',
        fixture: 'billing/subscription/200.get',
        requestAlias: 'getBillingSubscription',
      });
    });

    it('loads a preset report with additional filters when given a report query param and filter param', () => {
      cy.visit(PAGE_URL);
      cy.findByText('Engagement Report').should('not.be.visible');

      cy.visit(`${PAGE_URL}&report=engagement`);
      cy.findByText('Engagement Report').should('be.visible');
      cy.findAllByText('Sent').should('be.visible');
      cy.findAllByText('Accepted').should('be.visible');
      cy.findAllByText('Clicks').should('be.visible');
      cy.findAllByText('Open Rate').should('be.visible');

      cy.visit(`${PAGE_URL}&report=engagement&filters=Campaign:Christmas`);
      cy.findAllByText('Christmas').should('be.visible');
    });

    it('Selecting a preset report works correctly', () => {
      cy.visit(PAGE_URL);
      cy.withinMainContent(() => {
        cy.findByLabelText('Report').type('engagement');
        cy.findByText('Engagement Report').should('be.visible');
        cy.findByText('Engagement Report').click({ force: true });
        cy.wait(['@getTimeSeries', '@getDeliverability']);

        cy.findAllByText('Sent').should('be.visible');
        cy.findAllByText('Accepted').should('be.visible');
        cy.findAllByText('Clicks').should('be.visible');
        cy.findAllByText('Open Rate').should('be.visible');
      });
    });

    it('Changing from a preset/initial report to a preset report keeps existing time range and filters', () => {
      cy.visit(PAGE_URL);
      const assertions = () => {
        cy.findByDataId('report-options').within(() => {
          cy.findByLabelText('Precision').should('have.value', 'day');
          cy.findByText('Filters').should('be.visible');
          cy.findByText('Campaign').should('be.visible');
          cy.findByText('equals').should('be.visible');
          cy.findByText('test-campaign').should('be.visible');
        });
        cy.url().should('include', 'range=7days');
      };

      //Add filters and change time range
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/campaigns*',
          fixture: 'metrics/campaigns/200.get.json',
          requestAlias: 'getCampaigns',
        });
        cy.findByLabelText('Type').select('Campaign');
        cy.findByLabelText('Campaign').type('test');
        cy.wait('@getCampaigns');
        cy.findByText('test-campaign')
          .should('be.visible')
          .click();
        cy.findByText('Apply Filters').click();
      });

      cy.findByLabelText('Date Range').click();
      cy.findByText('Last 7 Days').click();
      cy.findByText('Apply').click();
      cy.findByLabelText('Precision').select('Day');

      cy.withinMainContent(() => {
        cy.wait(['@getUTCTimeSeries', '@getUTCDeliverability']);
        assertions();

        //Change to engagement report
        cy.findByLabelText('Report').type('Engagement');
        cy.findByText('Engagement Report').click({ force: true });
        assertions();
        cy.findAllByText('Sent').should('be.visible');

        //Change to summary report
        cy.findByLabelText('Report')
          .clear()
          .type('Summary');
        cy.findByText('Summary Report').click({ force: true });
        cy.wait(['@getUTCTimeSeries', '@getUTCDeliverability']);
        assertions();
        cy.findAllByText('Targeted').should('be.visible');
      });
    });

    it('Saves a new report', () => {
      cy.stubRequest({
        method: 'POST',
        url: '/api/v1/reports',
        fixture: 'reports/200.post.json',
        requestAlias: 'saveNewReport',
      });

      cy.visit(PAGE_URL);

      cy.findByRole('button', { name: 'Save New Report' }).click();

      cy.withinModal(() => {
        cy.findByText('Save New Report').should('be.visible');

        //Check validation
        cy.findByRole('button', { name: 'Save Report' }).click();
        cy.findAllByText('Required').should('have.length', 2);

        //Check submission
        cy.get('[name="name"]').type('Hello There');
        cy.get('[name="description"]').type('General Kenobi');
        cy.get('[name="is_editable"]').check({ force: true });
        cy.findByRole('button', { name: 'Save Report' }).click();
      });
      cy.wait('@saveNewReport');
      cy.findByText('You have successfully saved Hello There').click();
    });

    describe('with save reports', () => {
      beforeEach(() => {
        cy.stubRequest({
          url: '/api/v1/reports',
          fixture: 'reports/200.get',
          requestAlias: 'getSavedReports',
        });
      });

      it('loads saved reports', () => {
        cy.visit(PAGE_URL);
        cy.wait('@getSavedReports');
        cy.findByLabelText('Report').focus();

        cy.findListBoxByLabelText('Report').within(() => {
          cy.get(`a[role="option"]`)
            .eq(0)
            .should('have.contain', 'My Bounce Report')
            .should('have.contain', 'mockuser');

          cy.get(`a[role="option"]`)
            .eq(1)
            .should('have.contain', 'Your Sending Report')
            .should('have.contain', 'sally-sender');

          cy.get(`a[role="option"]`)
            .eq(2)
            .should('have.contain', 'Summary Report')
            .should('have.contain', 'Default');
        });
      });

      it('loads a saved report', () => {
        cy.visit(PAGE_URL);
        cy.wait('@getSavedReports');
        cy.findByLabelText('Report').focus(); // open typeahead

        cy.findListBoxByLabelText('Report').within(() => {
          cy.get(`a[role="option"]`)
            .eq(0)
            .should('have.contain', 'My Bounce Report')
            .click();
        });

        cy.findByLabelText('Report').should('have.value', 'My Bounce Report');
        cy.findByLabelText('Time Zone').should('have.value', '(UTC-04:00) America/New York');
        cy.findByLabelText('Precision').should('have.value', 'hour');

        cy.get('[data-id="metric-tag"]')
          .should('have.length', 1)
          .eq(0)
          .should('have.contain', 'Bounces');
      });

      it('opens saved reports modal', () => {
        cy.visit(PAGE_URL);
        cy.wait('@getSavedReports');
        cy.findByRole('button', { name: 'View All Reports' }).click();

        cy.withinModal(() => {
          //Check that it only shows my reports
          cy.findByText('My Bounce Report').should('be.visible');
          cy.findByText('Your Sending Report').should('not.be.visible');
          //Check that it shows all reports
          cy.findByRole('tab', { name: 'All Reports' }).click();
          cy.findAllByText('My Bounce Report').should('have.length', 2); //For both tabs
          cy.findAllByText('My Bounce Report')
            .first()
            .should('be.hidden');
          cy.findAllByText('My Bounce Report')
            .last()
            .should('be.visible');
          cy.findByText('Your Sending Report').should('be.visible');
        });
      });

      it('disabled creating new reports when limit is reached', () => {
        cy.stubRequest({
          url: '/api/v1/billing/subscription',
          fixture: 'billing/subscription/200.get.reports-limited',
          requestAlias: 'getBillingSubscription',
        });
        cy.visit(PAGE_URL);
        cy.wait('@getSavedReports');
        cy.findByRole('button', { name: 'Save New Report' }).should('be.disabled');
        cy.findByDataId('reports-limit-tooltip-icon').should('exist');
      });
    });
  });
}
