import { IS_HIBANA_ENABLED } from 'cypress/constants';
const PAGE_URL = '/reports/engagement';
const DELIVERABILITY_API_URL = '/api/v1/metrics/deliverability**/**';
const STABLE_UNIX_DATE = 1581087062000; // Stable unix timestamp (2/6/2020)

// NOTE: The majority of tests in this file are failing in CI
// but never fail locally. Due to a lack of access to screenshots/videos
// at this point in time, commenting these out for the time being.

// function waitForInitialRequests() {
//   cy.wait(['@subaccountsRequest', '@deliverabilityRequest', '@linkNameRequest']);
// }

// Waiting on fix for: https://github.com/cypress-io/cypress/issues/4460 to re-introduce these tests

if (!IS_HIBANA_ENABLED) {
  describe('The engagement report page', () => {
    beforeEach(() => {
      cy.stubAuth();
      cy.login({ isStubbed: true });

      cy.stubRequest({
        url: '/api/v1/subaccounts',
        fixture: 'subaccounts/200.get.json',
        requestAlias: 'subaccountsRequest',
      });

      cy.stubRequest({
        url: DELIVERABILITY_API_URL,
        fixture: 'metrics/deliverability/200.get.json',
        requestAlias: 'deliverabilityRequest',
      });

      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/link-name**/**',
        fixture: 'metrics/deliverability/link-name/200.get.json',
        requestAlias: 'linkNameRequest',
      });
    });

    it('has a relevant page title', () => {
      cy.visit(PAGE_URL);

      cy.title().should('include', 'Engagement Report | Signals Analytics');
      cy.findByText('Engagement Report').should('be.visible');
    });

    // it('re-requests data when filtering by "Broad Date Range" and updates query params accordingly', () => {
    //   const broadDateRangeLabel = 'Broad Date Range';

    //   cy.clock(STABLE_UNIX_DATE);
    //   cy.visit(PAGE_URL);
    //   waitForInitialRequests();

    //   cy.stubRequest({
    //     url: DELIVERABILITY_API_URL,
    //     fixture: 'metrics/deliverability/200.get.different-results.json',
    //     requestAlias: 'deliverabilityDifferentResults',
    //   });

    //   cy.findByLabelText(broadDateRangeLabel).select('Last Hour');
    //   cy.url().should('include', 'range=hour');

    //   cy.findByLabelText(broadDateRangeLabel).select('Last 24 Hours');
    //   cy.url().should('include', 'range=day');

    //   cy.findByLabelText(broadDateRangeLabel).select('Last 7 Days');
    //   cy.url().should('include', 'range=7days');

    //   cy.findByLabelText(broadDateRangeLabel).select('Last 30 Days');
    //   cy.url().should('include', 'range=30days');

    //   cy.findByLabelText(broadDateRangeLabel).select('Last 90 Days');
    //   cy.url().should('include', 'range=90days');

    //   cy.wait('@deliverabilityDifferentResults');

    //   cy.get('[data-id="summary-panel"]').within(() => {
    //     // This may seem like an odd way to check for different data,
    //     // but this is a check for unusual numbers that aren't as realistic
    //     // as the default `200.get.json` fixture
    //     cy.findByText('123');
    //     cy.findByText('789');
    //     cy.findByText('456');
    //   });
    // });

    // it('renders engagement metrics as text', () => {
    //   cy.clock(STABLE_UNIX_DATE);
    //   cy.visit(PAGE_URL);
    //   waitForInitialRequests();

    //   cy.get('[data-id="summary-panel"]').within(() => {
    //     cy.get('[data-id="unique-open-rate"]').should('contain', '> 100%');
    //     cy.get('[data-id="unique-click-rate"]').should('contain', '75%');
    //     cy.get('[data-id="count-sent"]').should('contain', '325,000'); // `count_sent`
    //     cy.get('[data-id="count-accepted"]').should('contain', '200,000'); // `count_accepted`
    //     cy.get('[data-id="count-opened"]').should('contain', '250,000'); // `count_unique_confirmed_opened_approx`
    //     cy.get('[data-id="count-unique-clicks"]').should('contain', '150,000'); // `count_unique_clicked_approx`
    //   });
    // });

    // it('renders "Sent", "Accepted", "Unique Confirmed Opens", and "Unique Clicks" data within a chart', () => {
    //   cy.clock(STABLE_UNIX_DATE);
    //   cy.visit(PAGE_URL);
    //   waitForInitialRequests();

    //   cy.get('.recharts-wrapper').within(() => {
    //     cy.findByText('150K').should('be.visible'); // `count_sent`
    //     cy.findByText('200K').should('be.visible'); // `count_unique_confirmed_opened_approx`
    //     cy.findByText('250K').should('be.visible'); // `count_accepted`
    //     cy.findByText('325K').should('be.visible'); // `count_unique_clicked_approx`
    //   });
    // });

    // describe('the click tracking table', () => {
    //   function assertTableRow({ rowIndex, row }) {
    //     cy.get('tbody tr')
    //       .eq(rowIndex)
    //       .within(() => {
    //         cy.get('td')
    //           .eq(0)
    //           .should('contain', row.link);
    //         cy.get('td')
    //           .eq(1)
    //           .should('contain', row.uniqueClicks);
    //         cy.get('td')
    //           .eq(2)
    //           .should('contain', row.clicks);
    //         cy.get('td')
    //           .eq(3)
    //           .should('contain', row.percentOfTotal);
    //       });
    //   }

    //   function assertDescending() {
    //     assertTableRow({
    //       rowIndex: 0,
    //       row: {
    //         link: 'Mock Link 4',
    //         uniqueClicks: '40',
    //         clicks: '40',
    //         percentOfTotal: '40%',
    //       },
    //     });

    //     assertTableRow({
    //       rowIndex: 1,
    //       row: {
    //         link: 'Mock Link 3',
    //         uniqueClicks: '30',
    //         clicks: '30',
    //         percentOfTotal: '30%',
    //       },
    //     });

    //     assertTableRow({
    //       rowIndex: 2,
    //       row: {
    //         link: 'Mock Link 2',
    //         uniqueClicks: '20',
    //         clicks: '20',
    //         percentOfTotal: '20%',
    //       },
    //     });

    //     assertTableRow({
    //       rowIndex: 3,
    //       row: {
    //         link: 'Mock Link 1',
    //         uniqueClicks: '10',
    //         clicks: '10',
    //         percentOfTotal: '10%',
    //       },
    //     });
    //   }

    //   function assertAscending() {
    //     assertTableRow({
    //       rowIndex: 0,
    //       row: {
    //         link: 'Mock Link 1',
    //         uniqueClicks: '10',
    //         clicks: '10',
    //         percentOfTotal: '10%',
    //       },
    //     });

    //     assertTableRow({
    //       rowIndex: 1,
    //       row: {
    //         link: 'Mock Link 2',
    //         uniqueClicks: '20',
    //         clicks: '20',
    //         percentOfTotal: '20%',
    //       },
    //     });

    //     assertTableRow({
    //       rowIndex: 2,
    //       row: {
    //         link: 'Mock Link 3',
    //         uniqueClicks: '30',
    //         clicks: '30',
    //         percentOfTotal: '30%',
    //       },
    //     });

    //     assertTableRow({
    //       rowIndex: 3,
    //       row: {
    //         link: 'Mock Link 4',
    //         uniqueClicks: '40',
    //         clicks: '40',
    //         percentOfTotal: '40%',
    //       },
    //     });
    //   }

    //   function clickTableHeader({ content }) {
    //     cy.get('table thead').within(() => cy.findByText(content).click());
    //   }

    //   beforeEach(() => {
    //     cy.clock(STABLE_UNIX_DATE);
    //     cy.visit(PAGE_URL);
    //     waitForInitialRequests();
    //     cy.get('table').scrollIntoView();
    //   });

    //   it('is sorted in descending order of clicks by default', () => {
    //     assertDescending();
    //   });

    //   it('renders tooltips when hovering the "Unique Clicks" and "Clicks" table header cells', () => {
    //     function triggerTooltipEvent({ cellContent, event }) {
    //       cy.get('table').within(() => {
    //         cy.findByText(cellContent)
    //           .find('svg')
    //           .trigger(event);
    //       });
    //     }

    //     triggerTooltipEvent({ cellContent: 'Unique Clicks', event: 'mouseover' });

    //     cy.findByText(
    //       'Total number of messages which had at least one link selected one or more times.',
    //     ).should('be.visible');

    //     triggerTooltipEvent({ cellContent: 'Unique Clicks', event: 'mouseout' });

    //     triggerTooltipEvent({ cellContent: 'Clicks', event: 'mouseover' });

    //     cy.findByText('Total number of times that links were selected across all messages.').should(
    //       'be.visible',
    //     );

    //     triggerTooltipEvent({ cellContent: 'Clicks', event: 'mouseout' });
    //   });

    //   it('sorts alphabetically by "Link"', () => {
    //     clickTableHeader({ content: 'Link' });
    //     assertAscending();
    //     clickTableHeader({ content: 'Link' });
    //     assertDescending();
    //   });

    //   it('sorts numerically by "Unique Clicks", "Clicks", and "Percent of Total"', () => {
    //     clickTableHeader({ content: 'Unique Clicks' });
    //     assertAscending();
    //     clickTableHeader({ content: 'Unique Clicks' });
    //     assertDescending();

    //     clickTableHeader({ content: 'Clicks' });
    //     assertAscending();
    //     clickTableHeader({ content: 'Clicks' });
    //     assertDescending();

    //     clickTableHeader({ content: 'Percent of Total' });
    //     assertAscending();
    //     clickTableHeader({ content: 'Percent of Total' });
    //     assertDescending();
    //   });
    // });

    it('renders an error message when the server returns a bad response', () => {
      cy.clock(STABLE_UNIX_DATE);

      cy.stubRequest({
        statusCode: 400,
        url: DELIVERABILITY_API_URL,
        fixture: 'metrics/deliverability/400.get.json',
      });

      cy.visit(PAGE_URL);

      cy.findAllByText('Something went wrong.').should('have.length', 2);
      cy.findByText('No engagement to report').should('be.visible');
      cy.findByText('No clicks to report').should('be.visible');
    });
  });
}
