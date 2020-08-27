import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL } from './constants';
import { commonBeforeSteps } from './helpers';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report Saved Reports', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.metrics-rollup.json',
      });
      cy.visit(PAGE_URL);
    });

    it('loads a preset report with additional filters when given a report query param and filter param', () => {
      cy.findByDataId('report-select').should('not.have.value', 'engagement'); //TODO: Remove
      //cy.findByText('Engagement Report').should('not.be.visible');

      cy.visit(`${PAGE_URL}&report=engagement`);
      cy.findByDataId('report-select').should('have.value', 'engagement'); //TODO: Remove
      //cy.findByText('Engagement Report').should('be.visible');
      cy.findAllByText('Sent').should('be.visible');
      cy.findAllByText('Accepted').should('be.visible');
      cy.findAllByText('Clicks').should('be.visible');
      cy.findAllByText('Open Rate').should('be.visible');

      cy.visit(`${PAGE_URL}&report=engagement&filters=Campaign:Christmas`);
      cy.findAllByText('Christmas').should('be.visible');
    });

    it('Selecting a preset report works correctly', () => {
      cy.withinMainContent(() => {
        // cy.findByLabelText('Report').type('Engagement');
        cy.findByDataId('report-select').select('engagement'); //TODO: Remove
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
        // cy.findByLabelText('Report').type('Engagement');
        cy.findByDataId('report-select').select('engagement'); //TODO: Remove

        // cy.findByText('Engagement Report').click({ force: true });
        assertions();
        cy.findAllByText('Sent').should('be.visible');

        //Change to summary report
        // cy.findByLabelText('Report')
        //   .clear()
        //   .type('Summary');
        cy.findByDataId('report-select').select('summary'); //TODO: Remove
        // cy.findByText('Summary Report').click({ force: true });
        cy.wait(['@getUTCTimeSeries', '@getUTCDeliverability']);
        assertions();
        cy.findAllByText('Targeted').should('be.visible');
      });
    });
  });
}
