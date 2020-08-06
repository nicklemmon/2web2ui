describe('AllMessagesPage', () => {
  // todo, maybe add tests for region and sending-ips
  beforeEach(() => {
    cy.stubAuth();
    cy.login({ isStubbed: true });

    // get aggregate numbers
    cy.stubRequest({
      url: '/api/v1/inbox-placement/123/mailbox-provider',
      fixture: 'inbox-placement/200.get.mailbox-providers.json',
      requestAlias: 'getInboxPlacementMailboxProviders',
    });

    // get list of messages
    cy.stubRequest({
      url: '/api/v1/inbox-placement/123/messages?mailbox_providers=provider.us',
      fixture: 'inbox-placement/200.get.messages.json',
    });

    // get a message
    cy.stubRequest({
      url: '/api/v1/inbox-placement/123/messages/1',
      fixture: 'inbox-placement/messages/200.get.json',
    });

    cy.visit('inbox-placement/details/123/mailbox-provider/provider.us');
  });

  // todo, could use delay
  // it('loading', () => {
  //   cy.findByDataId('loading').should('be.visible');
  // });

  // it('renders aggregates', () => {
  //   cy.findByPanelTitle('Deliverability').within(() => {
  //     cy.findByAriaLabelledByText('Sent').should('contain', 4);
  //     cy.findByAriaLabelledByText('Inbox').should('contain', 2);
  //     cy.findByAriaLabelledByText('Spam').should('contain', 1);
  //     cy.findByAriaLabelledByText('Missing').should('contain', 1);
  //   });

  //   cy.findByPanelTitle('Authentication').within(() => {
  //     cy.findByAriaLabelledByText('SPF').should('contain', '0%');
  //     cy.findByAriaLabelledByText('DKIM').should('contain', '100%');
  //     cy.findByAriaLabelledByText('DMARC').should('contain', '0%');
  //   });
  // });

  it('renders collection of messages', () => {
    cy.get('tbody tr')
      .eq(0)
      .within(() => {
        cy.findByText('anthony@provider.us').should('be.visible');
        cy.findByText('Missing').should('be.visible');
        cy.get('td')
          .eq(2)
          .should('contain', '---');
        cy.get('td')
          .eq(3)
          .should('contain', '---');
        cy.get('td')
          .eq(4)
          .should('contain', '---');
        cy.findByText('View Header').should('be.visible');
      });

    cy.get('tbody tr')
      .eq(1)
      .within(() => {
        cy.findByText('curry@provider.us').should('be.visible');
        cy.findByText('Spam').should('be.visible');
        cy.get('td')
          .eq(2)
          .should('contain', '---');
        cy.get('td:nth-child(4) [data-id="auth-passed"]').should('be.visible');
        cy.get('td')
          .eq(4)
          .should('contain', '---');
        cy.findByText('View Header').should('be.visible');
      });

    cy.get('tbody tr')
      .eq(2)
      .within(() => {
        cy.findByText('larry@provider.us').should('be.visible');
        cy.findByText('Inbox').should('be.visible');
        cy.get('td')
          .eq(2)
          .should('contain', '---');
        cy.get('td:nth-child(4) [data-id="auth-passed"]').should('be.visible');
        cy.get('td')
          .eq(4)
          .should('contain', '---');
        cy.findByText('View Header').should('be.visible');
      });

    cy.get('tbody tr')
      .eq(3)
      .within(() => {
        cy.findByText('moe@provider.us').should('be.visible');
        cy.findByText('Inbox | Promotions Folder').should('be.visible');
        cy.get('td')
          .eq(2)
          .should('contain', '---');
        cy.get('td:nth-child(4) [data-id="auth-passed"]').should('be.visible');
        cy.get('td')
          .eq(4)
          .should('contain', '---');
        cy.findByText('View Header').should('be.visible');
      });
  });

  it('renders message headers in a modal', () => {
    cy.findByText('larry@provider.us')
      .closest('tr')
      .findByText('View Header')
      .click();

    cy.withinModal(() => {
      cy.findByText('Email Header').should('be.visible');
      cy.contains('Delivered-To: larry@provider.us').should('be.visible');
    });
  });
});
