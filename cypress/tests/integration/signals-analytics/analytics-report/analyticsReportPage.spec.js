import { PAGE_URL, METRICS } from './constants';
import { stubDeliverability, stubTimeSeries, stubSubaccounts, commonBeforeSteps } from './helpers';

if (Cypress.env('DEFAULT_TO_HIBANA') === true) {
  describe('Analytics Report', () => {
    beforeEach(() => {
      commonBeforeSteps();
      cy.visit(PAGE_URL);
    });

    it('renders the initial state of the page', () => {
      // cy.title().should('include', 'Analytics Report'); // TODO: Once OG theme is removed, adjust title and re-introduce test
      cy.findByRole('heading', { name: 'Analytics Report' }).should('be.visible');

      // Filtering form elements
      cy.findByText('Date Range').should('be.visible');
      cy.findByLabelText('Time Zone').should('be.visible');
      cy.findByLabelText('Precision').should('be.visible');

      // Default selected metrics
      cy.withinMainContent(() => {
        cy.findAllByText('Targeted').should('have.length', 2);
        cy.findAllByText('Accepted').should('have.length', 2);
        cy.findAllByText('Bounces').should('have.length', 2);
      });

      cy.get('.recharts-wrapper').should('be.visible');

      cy.findByLabelText('Break Down By').should('be.visible');
    });

    it('filters by metric', () => {
      // 1. Open the drawer, uncheck default metrics, check all metrics
      cy.findByText('Add Metrics').click();

      cy.withinDrawer(() => {
        cy.findByLabelText('Targeted').uncheck({ force: true });
        cy.findByLabelText('Accepted').uncheck({ force: true });
        cy.findByLabelText('Bounces').uncheck({ force: true });

        METRICS.forEach(metric => {
          cy.findByLabelText(metric.name).check({ force: true });
        });

        cy.findByText('Apply Metrics').click();
      });

      // 2. Wait for server response
      cy.wait(['@getTimeSeries', '@getDeliverability']);

      // 3. Verify that tags render for each metric *and* query params for each metric appear in the URL
      cy.withinMainContent(() => {
        METRICS.forEach(metric => {
          cy.findAllByText(metric.name).should('have.length', 2);
          cy.url().should('include', `metrics=${metric.queryParam}`);
        });
      });

      // 4. Open the drawer again, clear metrics except for one
      cy.findByText('Add Metrics').click();

      cy.withinDrawer(() => {
        cy.findByText('Apply Metrics').should('be.disabled');
        cy.findByText('Clear Metrics').click();
        cy.findByText('Apply Metrics').should('be.disabled');
        cy.findByLabelText('Admin Bounce Rate').check({ force: true });
        cy.findByText('Apply Metrics').should('not.be.disabled');
        cy.findByText('Apply Metrics').click();
      });

      // 5. Wait for the server response
      cy.wait(['@getTimeSeries', '@getDeliverability']);

      const uncheckedMetrics = METRICS.filter(metric => metric.name !== 'Admin Bounce Rate');

      // 6. Verify that that the only metric rendered is "Admin Bounce Rate"
      cy.withinMainContent(() => {
        uncheckedMetrics.forEach(metric => {
          cy.findAllByText(metric.name).should('not.be.visible');
          cy.url().should('not.include', `metrics=${metric.queryParam}`);
        });
      });

      cy.findAllByText('Admin Bounce Rate').should('be.visible');
      cy.url().should('include', 'admin_bounce_rate');
    });

    it('removes currently active metrics when clicking the close button within metric tags', () => {
      function verifyMetricTagDismiss(tagContent) {
        const deliverabilityAlias = `getDeliverability${tagContent}`;
        const timeSeriesAlias = `getTimeSeries${tagContent}`;
        const metric = METRICS.find(metric => metric.name === tagContent);

        cy.url().should('include', `metrics=${metric.queryParam}`);

        stubDeliverability(deliverabilityAlias);
        stubTimeSeries(timeSeriesAlias);

        cy.findByText(tagContent)
          .closest('[data-id="metric-tag"]')
          .find('button')
          .click();

        cy.wait(`@${deliverabilityAlias}`).then(xhr => {
          cy.wrap(xhr.url).should('not.include', metric.queryParam);
        });
        cy.wait(`@${timeSeriesAlias}`).then(xhr => {
          cy.wrap(xhr.url).should('not.include', metric.queryParam);
        });

        cy.findByText(tagContent).should('not.be.visible');
        cy.url().should('not.include', `metrics=${metric.queryParam}`);
      }

      cy.findByDataId('report-options').within(() => {
        verifyMetricTagDismiss('Targeted');
        verifyMetricTagDismiss('Accepted');
      });
    });

    it('dynamically renders form fields based on selected resource type', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/domains?match=hello&limit=1000',
          fixture: 'metrics/domains/200.get.json',
          requestAlias: 'getDomains',
        });

        cy.findByLabelText('Type').select('Recipient Domain');
        cy.findByLabelText('Recipient Domain').should('be.visible');

        cy.findByLabelText('Type').select('Subaccount');
        cy.findByLabelText('Subaccount').should('be.visible');

        cy.findByLabelText('Type').select('Campaign');
        cy.findByLabelText('Campaign').should('be.visible');

        cy.findByLabelText('Type').select('Template');
        cy.findByLabelText('Template').should('be.visible');

        cy.findByLabelText('Type').select('Sending Domain');
        cy.findByLabelText('Sending Domain').should('be.visible');

        cy.findByLabelText('Type').select('IP Pool');
        cy.findByLabelText('IP Pool').should('be.visible');

        cy.findByLabelText('Type').select('Sending IP');
        cy.findByLabelText('Sending IP').should('be.visible');
      });
    });

    it('dynamically renders sets of resource type fields when clicking "Add Filter"', () => {
      function verifyNumberOfElements(expectedNumber) {
        cy.findAllByLabelText('Type').should('have.length', expectedNumber);
        cy.findAllByText('equals').should('have.length', expectedNumber);
        cy.findAllByText('Remove').should('have.length', expectedNumber);
      }

      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        // First verifying adding elements
        verifyNumberOfElements(1);

        cy.findByText('Add Filter').click();
        verifyNumberOfElements(2);

        cy.findByText('Add Filter').click();
        verifyNumberOfElements(3);

        cy.findByText('Add Filter').click();
        verifyNumberOfElements(4);

        cy.findByText('Add Filter').click();
        verifyNumberOfElements(5);

        // Then verifying their removal
        cy.findAllByText('Remove')
          .last()
          .click();
        verifyNumberOfElements(4);
        cy.findByText('Add Filter').should('be.visible');

        cy.findAllByText('Remove')
          .last()
          .click();
        verifyNumberOfElements(3);

        cy.findAllByText('Remove')
          .last()
          .click();
        verifyNumberOfElements(2);

        cy.findAllByText('Remove')
          .last()
          .click();
        verifyNumberOfElements(1);

        cy.findAllByText('Remove').should('not.be.visible');
      });
    });

    it('renders data filtered by "Recipient Domain"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/domains?match=hello&limit=1000',
          fixture: 'metrics/domains/200.get.json',
          requestAlias: 'getDomains',
        });
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('Recipient Domain');
        cy.findByLabelText('Recipient Domain').type('hello');
        cy.wait('@getDomains');
        cy.findByText('hello.com').click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'domains=hello.com');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'domains=hello.com');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Recipient Domain').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('hello.com').should('be.visible');
      });
    });

    it('renders data filtered by "Subaccount"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        stubSubaccounts('nextGetSubaccounts');
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('Subaccount');
        cy.findByLabelText('Subaccount').type('Fake Subaccount 1');
        cy.wait('@nextGetSubaccounts');
        cy.findByText('Fake Subaccount 1 (ID 101)').click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'subaccounts=101');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'subaccounts=101');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Subaccount').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('Fake Subaccount 1 (ID 101)').should('be.visible');
      });
    });

    it('renders data filtered by "Campaign"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/campaigns*',
          fixture: 'metrics/campaigns/200.get.json',
          requestAlias: 'getCampaigns',
        });
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('Campaign');
        cy.findByLabelText('Campaign').type('test');
        cy.wait('@getCampaigns');
        cy.findByText('test').should('be.visible');
        cy.findByText('test-campaign').should('be.visible');
        cy.findByText('Monitoring and Testing')
          .should('be.visible')
          .click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'campaigns=Monitoring+and+Testing');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'campaigns=Monitoring+and+Testing');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Campaign').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('Monitoring and Testing').should('be.visible');
      });
    });

    it('renders data filtered by "Template"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/templates*',
          fixture: 'metrics/templates/200.get.json',
          requestAlias: 'getTemplates',
        });
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('Template');
        cy.findByLabelText('Template').type('fake-template');
        cy.wait('@getTemplates');
        cy.findByText('fake-template-1').should('be.visible');
        cy.findByText('fake-template-2').should('be.visible');
        cy.findByText('fake-template-3')
          .should('be.visible')
          .click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'templates=fake-template-3');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'templates=fake-template-3');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Template').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('fake-template-3').should('be.visible');
      });
    });

    it('renders data filtered by "Sending Domain"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/sending-domains',
          fixture: 'sending-domains/200.get.json',
          requestAlias: 'getSendingDomains',
        });
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('Sending Domain');
        cy.findByLabelText('Sending Domain').type('bounce.uat');
        cy.wait('@getSendingDomains');
        cy.findByText('bounce.uat.sparkspam.com').click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'sending_domains=bounce.uat.sparkspam.com');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'sending_domains=bounce.uat.sparkspam.com');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Sending Domain').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('bounce.uat.sparkspam.com').should('be.visible');
      });
    });

    it('renders data filtered by "IP Pool"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/ip-pools*',
          fixture: 'metrics/ip-pools/200.get.json',
          requestAlias: 'getIPPools',
        });
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('IP Pool');
        cy.findByLabelText('IP Pool').type('myPool');
        cy.wait('@getIPPools');
        cy.findByText('myPool').click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'ip_pools=myPool');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'ip_pools=myPool');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('IP Pool').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('myPool').should('be.visible');
      });
    });

    it('renders data filtered by "Sending IP"', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.stubRequest({
          url: '/api/v1/metrics/sending-ips*',
          fixture: 'metrics/sending-ips/200.get.json',
          requestAlias: 'getSendingIPs',
        });
        stubDeliverability('nextGetDeliverability');
        stubTimeSeries('nextGetTimeSeries');

        cy.findByLabelText('Type').select('Sending IP');
        cy.findByLabelText('Sending IP').type('my-sending-ip');
        cy.wait('@getSendingIPs');
        cy.findByText('my-sending-ip').click();
        cy.findByText('Apply Filters').click();
      });

      cy.wait('@nextGetTimeSeries').then(xhr => {
        cy.wrap(xhr.url).should('include', 'sending_ips=my-sending-ip');
      });

      cy.wait('@nextGetDeliverability').then(xhr => {
        cy.wrap(xhr.url).should('include', 'sending_ips=my-sending-ip');
      });

      cy.findByDataId('report-options').within(() => {
        cy.findByText('Filters').should('be.visible');
        cy.findByText('Sending IP').should('be.visible');
        cy.findByText('equals').should('be.visible');
        cy.findByText('my-sending-ip').should('be.visible');
      });
    });

    it('closes the drawer when clicking the close button', () => {
      cy.findByText('Add Filters').click();

      cy.withinDrawer(() => {
        cy.findByLabelText('Type').should('be.visible');
        cy.findByText('Close').click({ force: true });
      });

      cy.findByLabelText('Type').should('not.be.visible');
    });
  });
}
