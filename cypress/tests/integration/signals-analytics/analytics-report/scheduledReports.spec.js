import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { commonBeforeSteps } from './helpers';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report Scheduled Reports', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.stubRequest({
        url: '/api/v1/account',
        fixture: 'account/200.get.has-scheduled-reports',
      });

      cy.stubRequest({
        url: `/api/v1/users`,
        fixture: 'users/200.get.list',
      });

      cy.stubRequest({
        url: '/api/v1/reports',
        fixture: '200.get.no-results',
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
        //This could cause CI tests to fail.
        //If this is flaky, delete this and the check for submit button being disabled after submit
        delay: 500,
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
      cy.findByLabelText('Time Zone')
        .focus()
        .clear()
        .type('America/New');
      cy.findByRole('option', { name: /\(UTC-0[45]:00\) America\/New York/ }).click(); ///Use regex for DST
      cy.findByRole('button', { name: 'Schedule Report' }).click();
      cy.findByRole('button', { name: 'Schedule Report' }).should('be.disabled');
      cy.findByRole('button', { name: 'Cancel' }).should('be.disabled');
      cy.wait('@createNewScheduledReport');
      cy.get('@createNewScheduledReport')
        .its('requestBody')
        .should('deep.equal', {
          name: 'My First Report',
          recipients: ['mockuser'],
          schedule: {
            day_of_month: '?',
            day_of_week: '*',
            hour: 0,
            minute: 0,
            month: '*',
            second: 0,
          },
          schedule_type: 'daily',
          subject: 'Free Macbook',
          timezone: 'America/New_York',
        });
      cy.url().should('include', '/signals/analytics');
      cy.findByText('Successfully scheduled My First Report for report: My Bounce Report').should(
        'be.visible',
      );
    });
  });
}
