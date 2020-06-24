const PAGE_BASE_URL = '/blocklist/watchlist';

describe('The blocklist watchlist page', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  it('shows title and info', () => {
    cy.stubRequest({
      url: 'api/v1/blacklist-monitors',
      fixture: 'blocklists/incident/200.get.watchlist.json',
    });

    cy.visit(PAGE_BASE_URL);

    cy.findByText(
      'Below are your watched IP addresses and domains. Select any one below to learn more or make updates.',
    ).should('be.visible');

    cy.findByText('Watched IPs and Domains').should('be.visible');
  });

  it('sorts the table', () => {
    cy.stubRequest({
      url: 'api/v1/blacklist-monitors',
      fixture: 'blocklists/incident/200.get.watchlist.json',
    });

    cy.visit(PAGE_BASE_URL);

    cy.findByLabelText('Sort Select').select('Date Listed');
    cy.get('tbody tr').then(val => {
      cy.findByText('12.12.12.', { container: val[0] }).should('be.visible');
      cy.findByText('anydomain.io', { container: val[1] }).should('be.visible');
      cy.findByText('buyadomain.io', { container: val[2] }).should('be.visible');
      cy.findByText('1.2.3.4', { container: val[3] }).should('be.visible');
      cy.findByText('127.0.0.2', { container: val[4] }).should('be.visible');
      cy.findByText('2.2.8', { container: val[5] }).should('be.visible');
    });

    cy.findByLabelText('Sort Select').select('Date Added');
    cy.get('tbody tr').then(val => {
      cy.findByText('2.2.8', { container: val[0] }).should('be.visible');
      cy.findByText('buyadomain.io', { container: val[1] }).should('be.visible');
      cy.findByText('anydomain.io', { container: val[2] }).should('be.visible');
      cy.findByText('1.2.3.4', { container: val[3] }).should('be.visible');
      cy.findByText('12.12.12.', { container: val[4] }).should('be.visible');
      cy.findByText('127.0.0.2', { container: val[5] }).should('be.visible');
    });

    cy.findByLabelText('Sort Select').select('Resource Name');
    cy.get('tbody tr').then(val => {
      cy.findByText('buyadomain.io', { container: val[0] }).should('be.visible');
      cy.findByText('anydomain.io', { container: val[1] }).should('be.visible');
      cy.findByText('2.2.8', { container: val[2] }).should('be.visible');
      cy.findByText('127.0.0.2', { container: val[3] }).should('be.visible');
      cy.findByText('12.12.12.', { container: val[4] }).should('be.visible');
      cy.findByText('1.2.3.4', { container: val[5] }).should('be.visible');
    });

    cy.findByLabelText('Sort Select').select('Current Listings');
    cy.get('tbody tr').then(val => {
      cy.findByText('127.0.0.2', { container: val[0] }).should('be.visible');
      cy.findByText('2.2.8', { container: val[1] }).should('be.visible');
      cy.findByText('12.12.12.', { container: val[2] }).should('be.visible');
      cy.findByText('1.2.3.4', { container: val[3] }).should('be.visible');
      cy.findByText('anydomain.io', { container: val[4] }).should('be.visible');
      cy.findByText('buyadomain.io', { container: val[5] }).should('be.visible');
    });

    cy.findByLabelText('Sort Select').select('Historic Listings');
    cy.get('tbody tr').then(val => {
      cy.findByText('127.0.0.2', { container: val[0] }).should('be.visible');
      cy.findByText('1.2.3.4', { container: val[1] }).should('be.visible');
      cy.findByText('2.2.8', { container: val[2] }).should('be.visible');
      cy.findByText('12.12.12.', { container: val[3] }).should('be.visible');
      cy.findByText('anydomain.io', { container: val[4] }).should('be.visible');
      cy.findByText('buyadomain.io', { container: val[5] }).should('be.visible');
    });
  });

  it('filters the result list down', () => {
    cy.stubRequest({
      url: 'api/v1/blacklist-monitors',
      fixture: 'blocklists/incident/200.get.watchlist.json',
    });

    cy.visit(PAGE_BASE_URL);

    cy.get('tbody tr').should('have.length', 6);
    cy.findByLabelText('Filter By').type('2.2.8');
    cy.get('tbody tr').should('have.length', 1);
  });

  it('stops monitoring', () => {
    cy.stubRequest({
      url: 'api/v1/blacklist-monitors',
      fixture: 'blocklists/incident/200.get.watchlist.json',
    });
    cy.stubRequest({
      method: 'DELETE',
      statusCode: 204,
      url: '/api/v1/blacklist-monitors/*',
      fixture: 'blocklists/incident/204.delete.json',
    });

    cy.visit(PAGE_BASE_URL);

    cy.get('tbody tr').then(val => {
      cy.findByText('Remove from Watchlist', { container: val[0] }).click();

      cy.withinModal(() => {
        cy.findByText(
          "Removing IP 12.12.12. from your watchlist means you won't get notified of changes, but don't worry you can always add it again later.",
        ).should('be.visible');
        cy.findAllByText('Remove from Watchlist')
          .last()
          .click();
      });
    });

    cy.withinSnackbar(alertContainer => {
      cy.findByText('Stopped Monitoring 12.12.12..', { container: alertContainer }).should(
        'be.visible',
      );
    });

    cy.get('tbody tr').then(val => {
      cy.findByText('1.2.3.4', { container: val[0] }).should('be.visible');
    });
  });

  it('links to the blocklist/incidents?search= page', () => {
    cy.stubRequest({
      url: 'api/v1/blacklist-monitors',
      fixture: 'blocklists/incident/200.get.watchlist.json',
    });

    cy.stubRequest({
      method: 'GET',
      url: 'api/v1/blacklist-monitors',
      fixture: 'blocklists/incident/200.get.search.json',
    });

    cy.visit(PAGE_BASE_URL);

    cy.get('tbody tr').then(val => {
      cy.findByText('2.2.8', { container: val[0] }).should(
        'have.attr',
        'href',
        '/blocklist/incidents?search=2.2.8',
      );
    });
  });
});
