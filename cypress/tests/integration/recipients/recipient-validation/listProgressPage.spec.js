const API_URL = '/api/v1/recipient-validation/job/fake-list';
const APP_URL = '/recipient-validation/list/fake-list';
const FIXTURE_BASE_URL = 'recipient-validation/job/fake-list';

describe('The recipient validation list progress page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('renders with a relevant page title', () => {
    cy.stubRequest({
      url: API_URL,
      fixture: `${FIXTURE_BASE_URL}/200.get.success.json`,
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
    });

    cy.visit(APP_URL);

    cy.title().should('include', 'Validation Status | List | Recipient Validation');
  });

  it('renders with the job ID/filename as a heading', () => {
    cy.stubRequest({
      url: API_URL,
      fixture: `${FIXTURE_BASE_URL}/200.get.success.json`,
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
    });

    cy.visit(APP_URL);

    cy.findByText('fake-list.csv').should('be.visible');
  });

  it('redirects to the list page when the user receives a 404 response', () => {
    cy.stubRequest({
      statusCode: 404,
      url: API_URL,
      fixture: `${FIXTURE_BASE_URL}/404.get.json`,
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
    });

    cy.visit(APP_URL);

    cy.findByText('Unable to find list fake-list');
    cy.url().should('include', '/recipient-validation/list');
    cy.findByText('Drag and drop your list here').should('be.visible');
  });

  it('renders the complete state when the batch status is "success"', () => {
    cy.stubRequest({
      url: API_URL,
      fixture: `${FIXTURE_BASE_URL}/200.get.success.json`,
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
    });

    cy.visit(APP_URL);

    cy.findByText('Complete').should('be.visible');
  });

  it('renders the error state when the batch status is "error"', () => {
    cy.stubRequest({
      url: API_URL,
      fixture: `${FIXTURE_BASE_URL}/200.get.error.json`,
    });
    cy.stubRequest({
      url: '/api/v1/billing',
      fixture: 'billing/200.get.json',
    });

    cy.visit(APP_URL);

    cy.findByText('Oh no! There seems to be an issue with your list...').should('be.visible');
    cy.verifyLink({ content: 'Got It', href: '/recipient-validation' });
  });

  describe('the "Processing" state', () => {
    it('renders while the batch status is "batch_triggered"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.batch_triggered.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "checking_regex"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.checking_regex.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "performing_decay_scoring"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.performing_decay_scoring.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "performing_did_you_mean"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.performing_did_you_mean.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "performing_free_email"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.performing_free_email.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "performing_mx_lookup"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.performing_mx_lookup.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "performing_role_based_lookup"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.performing_role_based_lookup.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "reading_upload_file"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.reading_upload_file.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('renders while the batch status is "uploading_results_to_s3"', () => {
      cy.stubRequest({
        url: API_URL,
        fixture: `${FIXTURE_BASE_URL}/200.get.uploading_results_to_s3.json`,
      });
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });

      cy.visit(APP_URL);

      cy.findByText('Processing').should('be.visible');
    });

    it('it renders a "Validation Error" and an alert with "Validation Limit Exceeded" if the batch status on the list page is "usage_limit_exceeded"', () => {
      cy.server();
      cy.stubRequest({
        url: '/api/v1/billing',
        fixture: 'billing/200.get.json',
      });
      cy.stubRequest({
        url: '/api/v1/billing/subscription',
        fixture: 'billing/subscription/200.get.json',
        fixtureAlias: 'subscriptionPremierGet',
      });
      cy.fixture('recipient-validation/list/200.get.usage-limit-exceeded.json').as('RVFixture');
      cy.route({
        url: '/api/v1/recipient-validation/job/fake-list',
        response: '@RVFixture',
      }).as('getValidation');

      cy.visit('/recipient-validation/list/fake-list');

      cy.wait('@getValidation');

      cy.findByText('Validation Error').should('be.visible');

      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000); // Wait for the polling interval as defined on the list progress component

      cy.findByText('Validation limit exceeded').should('be.visible');

      cy.findByText('View Details')
        .last()
        .click();
      cy.findByText('Submit a ticket').click();

      cy.findByText('I need help with...').should('be.visible');
    });
  });
});
