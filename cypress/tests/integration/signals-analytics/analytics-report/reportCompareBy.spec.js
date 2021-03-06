import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL } from './constants';
import { commonBeforeSteps } from './helpers';

const TYPE_LABEL = 'Type';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report - Compare By', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.stubRequest({
        url: '/api/v1/account',
        fixture: 'account/200.get.has-compare-by.json',
      });
      cy.visit(PAGE_URL);
    });

    it('Clicking compare button open compare by drawer', () => {
      openCompareByModal();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findAllByLabelText('Subaccount')
          .eq(0)
          .type('Fake Subaccount');
      });
    });

    it('Clicking add filter adds a new field for a filter', () => {
      openCompareByModal();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Add Subaccount' }).should('not.be.visible');
      });
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
      });
    });

    it('Clicking clear resets the form filters', () => {
      openCompareByModal();
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
        cy.findByRole('button', { name: 'Clear Comparison' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 0);
        cy.findByLabelText(TYPE_LABEL).should('have.value', null);
      });
    });

    it('Changing filter type unsets all existing fields', () => {
      openCompareByModal();
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
        cy.findByLabelText(TYPE_LABEL).select('Recipient Domain');
        cy.findAllByLabelText('Recipient Domain').should('have.length', 2);
        cy.findAllByLabelText('Recipient Domain')
          .eq(0)
          .should('have.value', '');
        cy.findAllByLabelText('Recipient Domain')
          .eq(1)
          .should('have.value', '');
      });
    });

    it('Clicking remove removes the appropriate field', () => {
      openCompareByModal();
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Remove Filter' }).should('not.be.visible');
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
        cy.findByRole('button', { name: 'Remove Filter' })
          .should('be.visible')
          .click();
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
      });
    });

    it('Properly submits the form and adds to reportOptions', () => {
      openCompareByModal();
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Compare' }).click();
      });
      cy.wait(['@getDeliverability', '@getTimeSeries']);

      cy.findByDataId('active-comparison-filters').within(() => {
        cy.findByText('Subaccount').should('be.visible');
        cy.findByText('Fake Subaccount 1 (ID 101)').should('be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
      });

      openCompareByModal();

      cy.findByLabelText(TYPE_LABEL).should('have.value', 'subaccounts');
      cy.findAllByLabelText('Subaccount')
        .eq(0)
        .should('have.value', 'Fake Subaccount 1 (ID 101)');
      cy.findAllByLabelText('Subaccount')
        .eq(1)
        .should('have.value', 'Fake Subaccount 3 (ID 103)');
    });

    it('clicking remove on tags properly remove comparison filters', () => {
      openCompareByModal();
      fillOutForm();
      addOneMoreField();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Compare' }).click();
      });

      cy.findByDataId('active-comparison-filters').within(() => {
        cy.findByText('Subaccount').should('be.visible');
        cy.findByText('Fake Subaccount 1 (ID 101)').should('be.visible');
        cy.findByText('Fake Subaccount 2 (ID 102)').should('be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
        cy.findAllByRole('button', { name: 'Remove' })
          .eq(0)
          .click();
        cy.findByText('Fake Subaccount 2 (ID 102)').should('be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
      });

      //Comparison added to filters after this point if last one
      cy.findByDataId('report-options').within(() => {
        cy.findByText('Fake Subaccount 1 (ID 101)').should('not.be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
      });
    });

    it('appends to filters if 2nd to last comparison removed', () => {
      openCompareByModal();
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Compare' }).click();
      });

      cy.findByDataId('active-comparison-filters').within(() => {
        cy.findByText('Subaccount').should('be.visible');
        cy.findByText('Fake Subaccount 1 (ID 101)').should('be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
        cy.findAllByRole('button', { name: 'Remove' })
          .eq(0)
          .click();
      });

      cy.findByDataId('active-comparison-filters').should('not.exist');

      //Comparison added to filters after this point if last one
      cy.findByDataId('report-options').within(() => {
        cy.findByText('Fake Subaccount 1 (ID 101)').should('not.be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
      });
    });

    it('Properly submits the form and renders multiple charts', () => {
      openCompareByModal();
      fillOutForm();
      cy.withinDrawer(() => {
        cy.findByRole('button', { name: 'Compare' }).click();
      });
      cy.wait(['@getDeliverability', '@getTimeSeries']);

      cy.get('.recharts-wrapper').should('have.length', 2);
      cy.findByRole('heading', { name: 'Fake Subaccount 1 (ID 101)' }).should('be.visible');
      cy.findByRole('heading', { name: 'Fake Subaccount 3 (ID 103)' }).should('be.visible');

      // TODO: When we have access to `cy.intercept()` we can separately stub each request and produce different results
      cy.findByDataId('compare-by-aggregated-metrics').within(() => {
        cy.findByText('Fake Subaccount 1 (ID 101)').should('be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
        cy.findAllByText('Sent').should('have.length', 2);
        cy.findAllByText('325K').should('have.length', 2);
        cy.findAllByText('Unique Confirmed Opens').should('have.length', 2);
        cy.findAllByText('250K').should('have.length', 2);
        cy.findAllByText('Accepted').should('have.length', 2);
        cy.findAllByText('200K').should('have.length', 2);
        cy.findAllByText('Unique Clicks').should('have.length', 2);
        cy.findAllByText('150K').should('have.length', 2);
      });
    });

    it('Shows form error if form contains less than 2 filters', () => {
      openCompareByModal();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findAllByLabelText('Subaccount')
          .eq(0)
          .type('Fake Subaccount');
        cy.findByText('Fake Subaccount 1 (ID 101)')
          .should('be.visible')
          .click();
        cy.findByRole('button', { name: 'Compare' }).click();
        cy.findByText('Select more than one item to compare').should('exist');
      });
    });

    it('Properly loads form with query parameter', () => {
      cy.visit(
        '/signals/analytics?comparisons%5B0%5D%5Btype%5D=Subaccount&comparisons%5B0%5D%5Bvalue%5D=Fake%20Subaccount%201%20%28ID%20101%29&comparisons%5B0%5D%5Bid%5D=101&comparisons%5B1%5D%5Btype%5D=Subaccount&comparisons%5B1%5D%5Bvalue%5D=Fake%20Subaccount%203%20%28ID%20103%29&comparisons%5B1%5D%5Bid%5D=103',
      );
      cy.wait(['@getSubaccounts', '@getDeliverability', '@getTimeSeries']);

      openCompareByModal();
      cy.findByLabelText(TYPE_LABEL).should('have.value', 'subaccounts');
      cy.findAllByLabelText('Subaccount')
        .eq(0)
        .should('have.value', 'Fake Subaccount 1 (ID 101)');
      cy.findAllByLabelText('Subaccount')
        .eq(1)
        .should('have.value', 'Fake Subaccount 3 (ID 103)');
    });
  });
}

function openCompareByModal() {
  cy.findByRole('button', { name: 'Add Comparison' }).click();
}

function fillOutForm() {
  cy.withinDrawer(() => {
    cy.findByLabelText(TYPE_LABEL).select('Subaccount');
    cy.findAllByLabelText('Subaccount')
      .eq(0)
      .type('Fake Subaccount');
    cy.findByText('Fake Subaccount 1 (ID 101)')
      .should('be.visible')
      .click();

    cy.findAllByLabelText('Subaccount')
      .eq(1)
      .type('Fake Subaccount');
    cy.findByText('Fake Subaccount 3 (ID 103)')
      .should('be.visible')
      .click();
  });
}

function addOneMoreField() {
  cy.findByRole('button', { name: 'Add Subaccount' }).click();
  cy.findAllByLabelText('Subaccount')
    .eq(2)
    .type('Fake Subaccount');
  cy.findByText('Fake Subaccount 2 (ID 102)')
    .should('be.visible')
    .click();
}
