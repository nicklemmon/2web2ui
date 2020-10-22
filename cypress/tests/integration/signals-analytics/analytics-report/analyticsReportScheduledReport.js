import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { commonBeforeSteps } from './helpers';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report Saved Reports', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.stubRequest({
        url: `/api/v1/users/${Cypress.env('USERNAME')}`,
        fixture: 'users/200.get.metrics-rollup-and-saved-reports',
      });

      cy.stubRequest({
        url: `/api/v1/users`,
        fixture: 'users/200.get.list',
      });

      cy.stubRequest({
        url: '/api/v1/reports/*',
        fixture: 'reports/single/200.get',
      });

      cy.stubRequest({
        url: '/api/v1/billing/subscription',
        fixture: 'billing/subscription/200.get',
        requestAlias: 'getBillingSubscription',
      });

      cy.stubRequest({
        method: 'POST',
        url: 'api/v1/reports/**/schedules',
        fixture: 'blank',
        requestAlias: 'createNewScheduledReport',
      });
    });

    it('Handles field validation correctly', () => {
      cy.visit('/signals/schedule/foo');
      cy.findByRole('button', { name: 'Schedule Report' }).click();
      cy.findAllByText('Required').should('have.length', 3);
      cy.findByText('At least 1 recipient must be selected').should('be.visible');

      cy.findByLabelText('Scheduled Report Name').type('My First Report');
      cy.findAllByText('Required').should('have.length', 2);

      cy.findByLabelText('Email Subject').type('Free Macbook');
      cy.findAllByText('Required').should('have.length', 1);

      cy.findByLabelText('Send To').click();
      cy.findByText('Name: mockuser ---- Email: mockuser@example.com').click();
      cy.findByText('At least 1 recipient must be selected').should('not.be.visible');

      cy.findByLabelText('Time').type('Lunchtime');
      cy.findByText('Required').should('not.be.visible');
      cy.findByText('Invalid time format, should be hh:mm 12 hour format').should('be.visible');

      cy.findByLabelText('Time')
        .focus()
        .clear()
        .type('12:00');
      cy.findByText('Invalid time format, should be hh:mm 12 hour format').should('not.be.visible');
    });

    it('Submits form properly', () => {
      cy.visit('/signals/schedule/foo');

      cy.findByLabelText('Scheduled Report Name').type('My First Report');
      cy.findByLabelText('Email Subject').type('Free Macbook');
      cy.findByLabelText('Send To').click();
      cy.findByText('Name: mockuser ---- Email: mockuser@example.com').click();
      cy.findByLabelText('Time')
        .focus()
        .clear()
        .type('12:00');
      cy.findByRole('button', { name: 'Schedule Report' }).click();
      cy.get('@createNewScheduledReport')
        .its('requestBody')
        .should('deep.equal', {
          description: 'NA',
          name: 'My First Report',
          recipients: ['mockuser'],
          schedule: {
            day_of_month: '*',
            day_of_week: '*',
            hour: 0,
            minute: 0,
            month: '*',
            second: 0,
          },
          subject: 'Free Macbook',
        });
      cy.findByText('Scheduled My First Report for report: My Bounce Report').should('be.visible');
    });
  });
}
