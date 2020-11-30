describe('The sign up page', () => {
  before(() => {
    cy.stubRequest({
      method: 'POST',
      url: 'https://www.google.com/recaptcha/**/*',
      fixture: 'recaptcha/200.post.json',
    });
  });

  beforeEach(() => {
    cy.viewport(1000, 1000); // Helps avoid cookies <Snackbar/>
    cy.visit('/join');
  });

  it('has the title "Sign Up"', () => {
    cy.title().should('include', 'Sign Up');
    cy.findByRole('heading', { name: 'Sign Up for SparkPost' }).should('be.visible');
  });

  it('renders the "Create Account" button enabled when all fields are filled out', () => {
    cy.findByRole('button', { name: 'Create Account' }).should('be.disabled');

    cy.findByLabelText('First Name').type('Ron');
    cy.findByLabelText('Last Name').type('Swanson');
    cy.findByLabelText('Email').type('ron.swanson@pawnee.indiana.state.us.gov');
    cy.findByLabelText('Password').type('mulliganssteakhouse');
    cy.get('[name="tou_accepted"]').check({ force: true }); // Unable to use `queryByLabelText` because HTML is structured incorrectly in the Matchbox component
    cy.findByRole('button', { name: 'Create Account' }).should('not.be.disabled');
  });

  it('renders an error when the user enters an email address in an invalid format', () => {
    cy.findByLabelText('Email')
      .type('hello@')
      .blur();

    cy.findByText('Invalid Email').should('be.visible');
  });

  it('renders a link to the log in page and the terms of service', () => {
    cy.verifyLink({
      content: 'Log In',
      href: '/auth',
    });
    cy.verifyLink({
      content: 'Terms of Use',
      href: 'https://www.sparkpost.com/policies/tou',
    });
  });
});
