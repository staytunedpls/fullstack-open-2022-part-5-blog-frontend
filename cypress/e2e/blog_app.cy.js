describe('blog app', () => {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Test username 1',
      username: 'Test username 1',
      password: 'Test password 1',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('login screen is shown', () => {
    cy.contains('Log in to application');
    cy.contains('username');
  });
  it('try to login', () => {
    cy.get('#username').type('Test username 1');
    cy.get('#password').type('Test password 1');
    cy.get('#login-btn').click();
    cy.contains('logged in');
  });
});
