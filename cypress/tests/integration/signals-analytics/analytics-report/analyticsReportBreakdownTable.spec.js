import { IS_HIBANA_ENABLED } from 'cypress/constants';
import { PAGE_URL, STABLE_UNIX_DATE } from './constants';

function verifyRow({ rowIndex, firstCell, secondCell, thirdCell, fourthCell, fifthCell }) {
  cy.get('tbody tr')
    .eq(rowIndex)
    .within(() => {
      cy.get('td')
        .eq(0)
        .should('contain', firstCell);

      cy.get('td')
        .eq(1)
        .should('contain', secondCell);

      cy.get('td')
        .eq(2)
        .should('contain', thirdCell);

      cy.get('td')
        .eq(3)
        .should('contain', fourthCell);

      cy.get('td')
        .eq(4)
        .should('contain', fifthCell);
    });
}

if (IS_HIBANA_ENABLED) {
  describe('Analytics Report breakdown table', () => {
    beforeEach(() => {
      cy.stubAuth();

      cy.stubRequest({
        url: '/api/v1/subaccounts',
        fixture: 'subaccounts/200.get.json',
        requestAliasList: 'getSubaccountList',
      });
      cy.login({ isStubbed: true });
    });

    it('renders data broken down by "Recipient Domain"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/watched-domain**/*',
        fixture: 'metrics/deliverability/watched-domain/200.get.json',
        requestAlias: 'getWatchedDomains',
      });

      cy.visit(PAGE_URL);

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Recipient Domain', { force: true });

      cy.wait('@getWatchedDomains');

      cy.findByLabelText('Top Domains Only').should('be.visible');

      cy.get('table').within(() => {
        cy.findByText('Recipient Domain').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'hotmail.com',
        secondCell: '9K',
        thirdCell: '10K',
        fourthCell: '11K',
        fifthCell: '12K',
      });

      verifyRow({
        rowIndex: 1,
        firstCell: 'yahoo.com',
        secondCell: '5',
        thirdCell: '6',
        fourthCell: '7',
        fifthCell: '8',
      });

      verifyRow({
        rowIndex: 2,
        firstCell: 'gmail.com',
        secondCell: '1',
        thirdCell: '2',
        fourthCell: '3',
        fifthCell: '4',
      });

      // Verifying that the "Top Domains Only" checkbox re-requests domains
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/domain**/*',
        fixture: 'metrics/deliverability/domain/200.get.json',
        requestAlias: 'getDomain',
      });

      cy.findByLabelText('Top Domains Only').uncheck({ force: true });

      cy.wait('@getDomain');

      cy.findByText('top-domains-only.com')
        .scrollIntoView()
        .should('be.visible');
    });

    it('renders data broken down by "Sending Domain"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/sending-domain**/*',
        fixture: 'metrics/deliverability/sending-domain/200.get.json',
        requestAlias: 'getSendingDomain',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Sending Domain', { force: true });

      cy.wait('@getSendingDomain');

      cy.get('table').within(() => {
        cy.findByText('Sending Domain').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'sparkpostbox.com',
        secondCell: '5.5K',
        thirdCell: '6.5K',
        fourthCell: '7.5K',
        fifthCell: '8.5K',
      });

      verifyRow({
        rowIndex: 1,
        firstCell: 'ymail.com',
        secondCell: '1',
        thirdCell: '2',
        fourthCell: '3',
        fifthCell: '4',
      });
    });

    it('renders data broken down by "Campaign"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/campaign**/*',
        fixture: 'metrics/deliverability/campaign/200.get.json',
        requestAlias: 'getCampaign',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Campaign', { force: true });

      cy.wait('@getCampaign');

      cy.get('table').within(() => {
        cy.findByText('Campaign').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'Free Beer',
        secondCell: '8',
        thirdCell: '0',
        fourthCell: '8',
        fifthCell: '0',
      });
    });

    it('renders data broken down by "Template"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/template**/*',
        fixture: 'metrics/deliverability/template/200.get.json',
        requestAlias: 'getTemplate',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Template', { force: true });

      cy.wait('@getTemplate');

      cy.get('table').within(() => {
        cy.findByText('Template').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'my-template-1',
        secondCell: '1',
        thirdCell: '2',
        fourthCell: '3',
        fifthCell: '4',
      });

      verifyRow({
        rowIndex: 1,
        firstCell: 'my-template-2',
        secondCell: '1',
        thirdCell: '2',
        fourthCell: '3',
        fifthCell: '4',
      });
    });

    it('renders data broken down by "Subaccount"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/subaccount**/*',
        fixture: 'metrics/deliverability/subaccount/200.get.json',
        requestAlias: 'getSubaccount',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Subaccount', { force: true });

      cy.wait('@getSubaccount');

      cy.get('table').within(() => {
        cy.findByText('Subaccount').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'Master Account (ID 0)',
        secondCell: '1.3K',
        thirdCell: '1.4K',
        fourthCell: '1.5K',
        fifthCell: '1.6K',
      });

      verifyRow({
        rowIndex: 1,
        firstCell: 'Subaccount 3',
        secondCell: '900',
        thirdCell: '1K',
        fourthCell: '1.1K',
        fifthCell: '1.2K',
      });

      verifyRow({
        rowIndex: 2,
        firstCell: 'Subaccount 2',
        secondCell: '500',
        thirdCell: '600',
        fourthCell: '700',
        fifthCell: '800',
      });

      verifyRow({
        rowIndex: 3,
        firstCell: 'Subaccount 1',
        secondCell: '100',
        thirdCell: '200',
        fourthCell: '300',
        fifthCell: '400',
      });
    });

    it('renders data broken down by "Sending IP"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/sending-ip**/*',
        fixture: 'metrics/deliverability/sending-ip/200.get.json',
        requestAlias: 'getSendingIP',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Sending IP', { force: true });

      cy.wait('@getSendingIP');

      cy.get('table').within(() => {
        cy.findByText('Sending IP').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'This is a real sending IP, alright.',
        secondCell: '9K',
        thirdCell: '10K',
        fourthCell: '11K',
        fifthCell: '12K',
      });

      verifyRow({
        rowIndex: 1,
        firstCell: 'Confirmation',
        secondCell: '5K',
        thirdCell: '6K',
        fourthCell: '7K',
        fifthCell: '8K',
      });

      verifyRow({
        rowIndex: 2,
        firstCell: 'Password Reset',
        secondCell: '1K',
        thirdCell: '2K',
        fourthCell: '3K',
        fifthCell: '4K',
      });
    });

    it('renders data broken down by "IP Pool"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/ip-pool**/*',
        fixture: 'metrics/deliverability/ip-pool/200.get.json',
        requestAlias: 'getIPPool',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('IP Pool', { force: true });

      cy.wait('@getIPPool');

      cy.get('table').within(() => {
        cy.findByText('IP Pool').should('be.visible');
      });

      verifyRow({
        rowIndex: 0,
        firstCell: 'highway',
        secondCell: '5K',
        thirdCell: '6K',
        fourthCell: '7K',
        fifthCell: '8K',
      });

      verifyRow({
        rowIndex: 1,
        firstCell: 'to',
        secondCell: '500',
        thirdCell: '600',
        fourthCell: '700',
        fifthCell: '800',
      });

      verifyRow({
        rowIndex: 2,
        firstCell: 'thedangerzone',
        secondCell: '50',
        thirdCell: '60',
        fourthCell: '70',
        fifthCell: '80',
      });
    });

    it('renders an empty state when no results are returned', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/ip-pool**/*',
        fixture: '200.get.no-results.json',
        requestAlias: 'getIPPool',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('IP Pool', { force: true });

      cy.wait('@getIPPool');

      cy.findByText('There is no data to display').should('be.visible');
    });

    it('clicking on a resource adds it as a filter"', () => {
      cy.clock(STABLE_UNIX_DATE);
      cy.visit(PAGE_URL);
      cy.stubRequest({
        url: '/api/v1/metrics/deliverability/template**/*',
        fixture: 'metrics/deliverability/template/200.get.json',
        requestAlias: 'getTemplate',
      });

      cy.findByLabelText('Break Down By')
        .scrollIntoView()
        .select('Template', { force: true });

      cy.wait('@getTemplate');

      cy.get('table').within(() => {
        cy.findByRole('button', { name: 'my-template-1 (Applies a filter to the report)' }).click({
          force: true,
        });
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Template').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('my-template-1').should('be.visible');
      });
    });
  });
}
