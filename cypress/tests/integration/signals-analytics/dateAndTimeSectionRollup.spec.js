import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { commonBeforeSteps } from './analytics-report/helpers';

const PAGE_URL_OG = '/reports/summary';
const PAGE_URL_HIBANA = '/signals/analytics';

describe('Date Time Section on Summary Report & Report Builder', () => {
  const timestamp = 1580392800000; //01/30/2020 @ 2:00pm (UTC)
  let getDatePickerText;

  beforeEach(() => {
    commonBeforeSteps();
    cy.stubRequest({
      url: `/api/v1/users/${Cypress.env('USERNAME')}`,
      fixture: 'users/200.get.metrics-rollup.json',
    });

    cy.stubRequest({
      url: '/api/v1/reports',
      fixture: '200.get.no-results',
    });

    cy.clock(timestamp);
    const now = Cypress.moment(timestamp)
      .local()
      .format('MMM Do YYYY h:mma');
    getDatePickerText = startDateTime => `${startDateTime} – ${now}`; //Use this dash: '–' ¯\_(ツ)_/¯
  });

  if (!IS_HIBANA_ENABLED) {
    it('default date and precision is applied correctly (OG)', () => {
      cy.visit(PAGE_URL_OG);

      const dayAgo = Cypress.moment(timestamp).subtract(1, 'day');

      cy.findByDataId('report-options').within(() => {
        cy.findByLabelText('Narrow Date Range').should(
          'have.value',
          getDatePickerText(dayAgo.local().format('MMM Do YYYY h:mma')),
        );
      });
      cy.wait('@getTimeSeries').should(xhr => {
        expect(xhr.url).to.contain('precision=hour');
        expect(xhr.url).to.contain(`from=${dayAgo.local().format('YYYY-MM-DDTHH:mm')}`);
      });
    });

    it('changing date picker values changes the precision correctly (OG)', () => {
      cy.visit(PAGE_URL_OG);
      cy.findByLabelText('Precision').should('have.value', 'hour');
      cy.findByLabelText('Narrow Date Range').click();

      //Check mouseover
      cy.get('[aria-label="Wed Jan 29 2020"]').click({ force: true });
      cy.get('[aria-label="Tue Dec 03 2019"]').trigger('mouseover', { force: true });
      cy.findByLabelText('Precision').should('have.value', 'day');

      //Check clicking picks current precision if available
      cy.get('[aria-label="Tue Jan 28 2020"]').click({ force: true });
      cy.findByLabelText('Precision').should('have.value', 'hour');
      cy.findByText('Cancel').click({ force: true });

      //Check date-range; picks recommended precision if current precision in unavailable
      cy.findByLabelText('Broad Date Range').select('Last 7 Days');
      cy.findByLabelText('Precision').should('have.value', 'hour');
      const dayAgo = Cypress.moment(timestamp)
        .startOf('hour')
        .subtract(7, 'day');
      cy.get('[id="fromDate"]').should('have.value', dayAgo.local().format('YYYY-MM-DD'));
      cy.get('[id="fromTime"]').should('have.value', dayAgo.local().format('h:mma'));
      //Re-stub so I can get the url params from the second call
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/time-series**/**',
        fixture: 'metrics/deliverability/time-series/200.get.json',
        requestAlias: 'getTimeSeries2',
      });
      cy.findByText('Apply').click({ force: true });
      cy.wait('@getTimeSeries2').should(xhr => {
        expect(xhr.url).to.contain('precision=hour');
        expect(xhr.url).to.contain(`from=${dayAgo.local().format('YYYY-MM-DDTHH:mm')}`);
      });
    });
  }

  if (IS_HIBANA_ENABLED) {
    it('default date and precision is applied correctly (Hibana)', () => {
      cy.visit(PAGE_URL_HIBANA);

      const weekAgo = Cypress.moment(timestamp).subtract(7, 'day');
      cy.findByDataId('report-options').within(() => {
        cy.findByLabelText('Date Range').should(
          'have.value',
          getDatePickerText(weekAgo.local().format('MMM Do YYYY h:mma')),
        );
      });
      cy.wait('@getTimeSeries').should(xhr => {
        expect(xhr.url).to.contain('precision=hour');
        expect(xhr.url).to.contain(`from=${weekAgo.local().format('YYYY-MM-DDTHH:mm')}`);
      });
      cy.findByLabelText('Precision').should('have.value', 'hour');
    });

    it('changing date picker values changes the precision correctly (Hibana)', () => {
      cy.visit(PAGE_URL_HIBANA);
      cy.findByLabelText('Precision').should('have.value', 'hour');
      cy.findByLabelText('Date Range').click();

      //Check mouseover
      cy.get('[aria-label="Wed Jan 29 2020"]').click({ force: true });
      cy.get('[aria-label="Tue Dec 03 2019"]').trigger('mouseover', { force: true });
      cy.findByLabelText('Precision').should('have.value', 'day');

      //Check clicking picks current precision if available
      cy.get('[aria-label="Thu Jan 16 2020"]').click({ force: true });
      cy.findByLabelText('Precision').should('have.value', 'hour');
      cy.findByText('Cancel').click({ force: true });

      //Check date-range; picks recommended precision if current precision in unavailable
      cy.findByLabelText('Precision').select('week', { force: true }); //Change precision so that it's no longer an option for "last 24 hours"
      cy.findByLabelText('Date Range').click();
      cy.findByText('Last 24 Hours').click({ force: true });
      cy.findByLabelText('Precision').should('have.value', 'hour');
      const dayAgo = Cypress.moment(timestamp)
        .startOf('hour')
        .subtract(1, 'day');
      cy.findByLabelText('From Date').should('have.value', dayAgo.local().format('YYYY-MM-DD'));
      cy.findByLabelText('From Time').should('have.value', dayAgo.local().format('h:mma'));
      //Re-stub so I can get the url params from the second call
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/time-series**',
        fixture: 'metrics/deliverability/time-series/200.get.json',
        requestAlias: 'getTimeSeries2',
      });
      cy.findByText('Apply').click({ force: true });
      cy.wait('@getTimeSeries2').should(xhr => {
        expect(xhr.url).to.contain('precision=hour');
        expect(xhr.url).to.contain(`from=${dayAgo.local().format('YYYY-MM-DDTHH:mm')}`);
      });
    });
  }
});
