import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL } from './constants';
import { commonBeforeSteps } from './helpers';

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
      cy.findByRole('button', { name: 'Compare' }).click();
      cy.withinDrawer(() => {
        cy.findByText('Compare By Placeholder').should('be.visible');
      });
    });
  });
}
