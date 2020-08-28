import { IS_HIBANA_ENABLED } from 'cypress/constants';

describe('Signals Demo', () => {
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });
  });

  if (IS_HIBANA_ENABLED) {
    it('', () => {
      cy.visit('/dashboard');

      cy.server();
      cy.route('GET', '/api/v1/*', { results: 'Name cannot be blank' }).as('@apiRequest');

      cy.findAllByText('Signals Analytics')
        .first()
        .click();

      cy.wait('@apiRequest');

      // cy.stubRequest({
      //   url: '/api/v1/account/sso/saml',
      //   fixture: 'account/sso/200.get.saml.json',
      //   requestAlias: 'ssoSamlGet',
      // });
      // cy.stubRequest({
      //   url: '/api/v1/users/mockuser/two-factor',
      //   fixture: 'users/two-factor/200.get.json',
      //   requestAlias: 'twoFactorGet',
      // });
    });
  }
});
