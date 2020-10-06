import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL } from './constants';
import { commonBeforeSteps } from './helpers';

const TYPE_LABEL = 'Type';
const COMPARE_BY_LABEL = 'Compare By';

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report filters form', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.stubRequest({
        url: '/api/v1/account',
        fixture: 'account/200.get.has-report-filters-v2.json',
        requestAlias: 'accountReq',
      });
    });

    it('allows the user to add a list of grouped filters and apply them by submitting the form', () => {
      navigateToForm();

      cy.withinDrawer(() => {
        fillOutForm();
      });
    });

    it('only renders the "is equal to" and "is not equal to" comparison options when the user selects the "Subaccount" filter type', () => {
      navigateToForm();

      cy.findByLabelText(TYPE_LABEL).select('Subaccount');
      cy.findByLabelText(COMPARE_BY_LABEL).within(() => {
        cy.findByRole('option', { name: 'contains' }).should('not.exist');
        cy.findByRole('option', { name: 'does not contain' }).should('not.exist');
        cy.findByRole('option', { name: 'is equal to' }).should('exist');
        cy.findByRole('option', { name: 'is not equal to' }).should('exist');
      });

      cy.findByLabelText(TYPE_LABEL).select('Template');
      cy.findByLabelText(COMPARE_BY_LABEL).within(() => {
        cy.findByRole('option', { name: 'contains' }).should('exist');
        cy.findByRole('option', { name: 'does not contain' }).should('exist');
        cy.findByRole('option', { name: 'is equal to' }).should('exist');
        cy.findByRole('option', { name: 'is not equal to' }).should('exist');
      });
    });

    it('allows the user to control the comparison type via "AND" and "OR" radio buttons', () => {
      navigateToForm();

      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Sending Domain');
        cy.findByLabelText(COMPARE_BY_LABEL).select('contains');
        cy.findByLabelText('Sending Domain').type('hello ');
        cy.findByRole('button', { name: 'Add And Filter' }).should('be.visible');
        cy.findAllByText('And').should('have.length', 4); // Two "And" buttons, comparison text, and some screen reader only content
        cy.findByRole('radio', { name: 'Or' }).check({ force: true });
        cy.findByRole('button', { name: 'Add And Filter' }).should('not.be.visible');
        cy.findByRole('button', { name: 'Add Or Filter' }).click();
        cy.findAllByText('Or').should('have.length', 2); // The button and the comparison text
      });
    });

    it('allows for removal of empty filter groups when no filters are present', () => {
      navigateToForm();

      cy.withinDrawer(() => {
        // Verifying remove button rendering within the first group
        cy.findByLabelText(TYPE_LABEL).select('Campaign');
        cy.findByLabelText(COMPARE_BY_LABEL).select('does not contain');
        cy.findByLabelText('Campaign').type('my-campaign is the best ');
        cy.findByRole('button', { name: 'Add And Filter' }).click();
        getGroupingByIndex(0).within(() => {
          cy.findAllByRole('button', { name: 'Remove Filter' }).should('have.length', 2);
        });

        // Verifying remove button rendering within new groups
        cy.findByRole('button', { name: 'Add And Grouping' }).click();
        getGroupingByIndex(1).within(() => {
          cy.findByRole('button', { name: 'Remove Filter' })
            .should('be.visible')
            .click();
        });
        getGroupingByIndex(0).should('be.visible');
        getGroupingByIndex(1).should('not.exist');

        // Verifying groups are removed appropriately
        cy.findByRole('button', { name: 'Add And Grouping' }).click();
        getGroupingByIndex(1).within(() => {
          cy.findByLabelText(TYPE_LABEL).select('Template');
          cy.findByLabelText(COMPARE_BY_LABEL).select('contains');
          cy.findByLabelText('Template').type('this is a template ');
        });
        cy.findByRole('button', { name: 'Add And Grouping' }).click();
        getGroupingByIndex(2).within(() => {
          cy.findByRole('button', { name: 'Remove Filter' }).click();
        });
        getGroupingByIndex(2).should('not.exist');
        getGroupingByIndex(1).within(() => {
          cy.findByRole('button', { name: 'Remove Filter' }).click();
        });
        getGroupingByIndex(1).should('not.exist');
      });

      // Verifying the initial state is rendered when all filters are removed
      cy.findAllByRole('button', { name: 'Remove Filter' })
        .eq(0)
        .click();
      cy.findAllByLabelText(TYPE_LABEL).should('have.length', 1);
      cy.findByLabelText(COMPARE_BY_LABEL).should('not.be.visible');
      cy.findByDataId('grouping').should('have.length', 1);
    });

    it('allows the user to enter multiple, free-form values within the filters field when the comparison is "contains" or "does not contain"', () => {
      navigateToForm();

      cy.withinDrawer(() => {
        cy.findByLabelText(TYPE_LABEL).select('Sending Domain');
        cy.findByLabelText(COMPARE_BY_LABEL).select('contains');
        cy.findByLabelText('Sending Domain').type(
          'tag-number-one tag-number-two tag-number-three ',
        );
        cy.findByText('tag-number-one').should('be.visible');
        cy.findByText('tag-number-two').should('be.visible');
        cy.findByText('tag-number-three').should('be.visible');

        cy.findAllByRole('button', { name: 'Remove' })
          .eq(0)
          .click();
        cy.findByText('tag-number-one').should('not.be.visible');
        cy.findByText('tag-number-two').should('be.visible');
        cy.findByText('tag-number-three').should('be.visible');

        cy.findAllByRole('button', { name: 'Remove' })
          .eq(0)
          .click();
        cy.findByText('tag-number-two').should('not.be.visible');
        cy.findByText('tag-number-two').should('not.be.visible');
        cy.findByText('tag-number-three').should('be.visible');

        cy.findAllByRole('button', { name: 'Remove' })
          .eq(0)
          .click();
        cy.findByText('tag-number-two').should('not.be.visible');
        cy.findByText('tag-number-two').should('not.be.visible');
        cy.findByText('tag-number-three').should('not.be.visible');
      });
    });

    describe('the filters typeahead', () => {
      beforeEach(() => navigateToForm());

      it('requests data according to the selected filter type', () => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findByLabelText(COMPARE_BY_LABEL).should('have.value', 'eq');
        cy.findByLabelText('Subaccount').type('Fake Subaccount');

        cy.wait('@getSubaccounts');

        cy.findByRole('option', { name: 'Fake Subaccount 1 (ID 101)' }).should('be.visible');
        cy.findByRole('option', { name: 'Fake Subaccount 2 (ID 102)' }).should('be.visible');
        cy.findByRole('option', { name: 'Fake Subaccount 3 (ID 103)' })
          .should('be.visible')
          .click();

        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
        cy.findByRole('radio', { name: 'And' }).should('be.checked');
        cy.findByRole('radio', { name: 'Or' }).should('not.be.checked');
      });

      it('returns no results when the user has entered fewer than 3 characters', () => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findByLabelText(COMPARE_BY_LABEL).should('have.value', 'eq');
        cy.findByLabelText('Subaccount').type('Fa');
        cy.findByText('No Results').should('be.visible');
      });

      it('returns no results when not the server returns no results for that filter type', () => {
        cy.stubRequest({
          url: '/api/v1/subaccounts',
          fixture: '200.get.no-results.json',
          requestAlias: 'getSubaccounts',
        });

        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findByLabelText(COMPARE_BY_LABEL).should('have.value', 'eq');
        cy.findByLabelText('Subaccount').type('Fake Subaccount');
        cy.wait('@getSubaccounts');

        cy.findByText('No Results').should('be.visible');
      });

      it('allows the user to enter multiple values as well as remove them after they have been added', () => {
        cy.findByLabelText(TYPE_LABEL).select('Subaccount');
        cy.findByLabelText(COMPARE_BY_LABEL).should('have.value', 'eq');

        cy.findByLabelText('Subaccount').type('Fake Subaccount');
        cy.findByRole('option', { name: 'Fake Subaccount 1 (ID 101)' }).click();

        cy.findByLabelText('Subaccount').type('Fake Subaccount');
        cy.findByRole('option', { name: 'Fake Subaccount 1 (ID 101)' }).should('not.be.visible');
        cy.findByRole('option', { name: 'Fake Subaccount 2 (ID 102)' }).click();

        cy.findByLabelText('Subaccount').type('Fake Subaccount');
        cy.findByRole('option', { name: 'Fake Subaccount 2 (ID 102)' }).should('not.be.visible');
        cy.findByRole('option', { name: 'Fake Subaccount 3 (ID 103)' }).click();

        cy.findByText('Fake Subaccount 1 (ID 101)').should('be.visible');
        cy.findByText('Fake Subaccount 2 (ID 102)').should('be.visible');
        cy.findByText('Fake Subaccount 3 (ID 103)').should('be.visible');
      });
    });

    it('handles filter clearing when the user clicks on "Clear Filters"', () => {
      navigateToForm();

      cy.withinDrawer(() => {
        fillOutForm();
        cy.findByRole('button', { name: 'Clear Filters' }).click();
        cy.findAllByLabelText(TYPE_LABEL)
          .should('have.length', 1)
          .should('be.visible')
          .should('have.value', null);
        cy.findAllByLabelText(COMPARE_BY_LABEL).should('not.be.visible');
        cy.findAllByRole('button', { name: 'Add And Filter' }).should('not.be.visible');
        cy.findAllByRole('button', { name: 'Add Or Filter' }).should('not.be.visible');
        cy.findByDataId('grouping').should('have.length', 1);
        cy.findAllByRole('group', { name: 'Filter By' }).should('have.length', 1);
      });
    });
  });
}

function navigateToForm() {
  cy.visit(PAGE_URL);
  cy.wait(['@getSubaccounts', '@getDeliverability', '@getTimeSeries']);

  cy.findByRole('button', { name: 'Add Filters' }).click();
}

function fillOutForm() {
  cy.findByLabelText(COMPARE_BY_LABEL).should('not.be.visible');
  cy.findByLabelText(TYPE_LABEL).select('Recipient Domain');
  cy.findByLabelText('Recipient Domain').should('be.visible');
  cy.findByLabelText(COMPARE_BY_LABEL)
    .should('have.value', 'eq')
    .select('contains');
  cy.findByLabelText('Recipient Domain').type('hello there friend these are some tags');
  cy.findByRole('radio', { name: 'And' })
    .should('exist')
    .should('be.checked');
  cy.findByRole('radio', { name: 'Or' })
    .should('exist')
    .should('not.be.checked');

  getGroupingByIndex(0).within(() => {
    getFilterByIndex(0).within(() => {
      // Adding an "AND" comparison filter within a grouping
      cy.findByRole('button', { name: 'Add And Filter' }).click();
    });

    getFilterByIndex(1).within(() => {
      cy.findByLabelText(TYPE_LABEL).select('Template');
      cy.findByLabelText(COMPARE_BY_LABEL)
        .should('have.value', 'eq')
        .select('does not contain');
      cy.findByLabelText('Template').type('template ');
      cy.findByRole('button', { name: 'Remove Filter' }).should('be.visible');
    });

    getFilterByIndex(0).within(() => {
      cy.findByRole('button', { name: 'Remove Filter' })
        .should('be.visible')
        .click();

      cy.findByLabelText(TYPE_LABEL).should('have.value', 'templates');
      cy.findByLabelText(COMPARE_BY_LABEL).should('have.value', 'notLike');
      cy.findByLabelText('Template').should('be.visible');
      cy.findByRole('radio', { name: 'And' }).should('exist');
      cy.findByRole('radio', { name: 'Or' }).should('exist');
    });
  });

  cy.findByRole('button', { name: 'Add And Grouping' }).click();

  getGroupingByIndex(1).within(() => {
    getFilterByIndex(0).within(() => {
      cy.findByLabelText(TYPE_LABEL).select('Sending Domain');
      cy.findByLabelText(COMPARE_BY_LABEL).select('contains');
      cy.findByLabelText('Sending Domain').type('thisisasendingdomain{enter}');
    });
  });
}

function getGroupingByIndex(index) {
  return cy.findByDataId('grouping').eq(index);
}

function getFilterByIndex(index) {
  // `role="group"` maps to the `<fieldset />` element
  return cy.findAllByRole('group', { name: 'Filter By' }).eq(index);
}
