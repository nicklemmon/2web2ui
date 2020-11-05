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
      cy.findByRole('button', { name: 'Add Comparison' }).click();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findAllByLabelText('Subaccount')
          .eq(0)
          .type('Fake Subaccount');
      });
    });

    it('Clicking add filter adds a new field for a filter', () => {
      cy.findByRole('button', { name: 'Add Comparison' }).click();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
      });
    });

    it('Clicking clear, resets the form filters', () => {
      cy.findByRole('button', { name: 'Add Comparison' }).click();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findAllByLabelText('Subaccount')
          .eq(0)
          .type('Fake Subaccount');
        cy.findByText('Fake Subaccount 3 (ID 103)')
          .should('be.visible')
          .click();
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
        cy.findByRole('button', { name: 'Clear Comparison' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 0);
        cy.findByLabelText(TYPE_LABEL).should('have.value', null);
      });
    });

    it('Changing filter type unsets all existing fields', () => {
      cy.findByRole('button', { name: 'Add Comparison' }).click();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findAllByLabelText('Subaccount')
          .eq(0)
          .type('Fake Subaccount');
        cy.findByText('Fake Subaccount 3 (ID 103)')
          .should('be.visible')
          .click();
        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
        cy.findByLabelText(TYPE_LABEL).select('Recipient Domain');
        cy.findAllByLabelText('Recipient Domain').should('have.length', 2);
        cy.findAllByLabelText('Recipient Domain')
          .eq(0)
          .should('have.value', '');
      });
    });

    it('Clicking remove removes the appropriate field', () => {
      cy.findByRole('button', { name: 'Add Comparison' }).click();
      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
        cy.findAllByLabelText('Subaccount')
          .eq(1)
          .type('Fake Subaccount');
        cy.findByText('Fake Subaccount 3 (ID 103)')
          .should('be.visible')
          .click();
        cy.findByRole('button', { name: 'Remove Filter' }).should('not.be.visible');

        cy.findByRole('button', { name: 'Add Subaccount' }).click();
        cy.findAllByLabelText('Subaccount').should('have.length', 3);
        cy.findByRole('button', { name: 'Remove Filter' })
          .should('be.visible')
          .click();
        cy.findAllByLabelText('Subaccount').should('have.length', 2);
      });
    });
  });
}
