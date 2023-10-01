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
  it('correct login works', () => {
    cy.get('#username').type('Test username 1');
    cy.get('#password').type('Test password 1');
    cy.get('#login-btn').click();
    cy.contains('logged in');
  });
  it('incorrect login fails miserably', () => {
    cy.get('#username').type('Test username 1');
    cy.get('#password').type('Test password 2');
    cy.get('#login-btn').click();
    cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
  });
});

describe('when already logged in', () => {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Test username 1',
      username: 'Test username 1',
      password: 'Test password 1',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.request('POST', 'http://localhost:3003/api/login', {
      username: 'Test username 1',
      password: 'Test password 1',
    }).then(response => {
      localStorage.setItem('loggedUser', JSON.stringify(response.body));
      cy.request({
        method: 'POST',
        url: 'http://localhost:3003/api/blogs/',
        body: {
          title: 'Test title 1',
          author: 'Test author 1',
          url: 'url',
          user: `${JSON.stringify(localStorage.getItem('loggedUser')._id)}`,
        },
        headers: {
          Authorization: `bearer ${
            JSON.parse(localStorage.getItem('loggedUser')).token
          }`,
        },
      });
      cy.visit('http://localhost:3000');
    });
  });
  it('user can create a new blog', () => {
    cy.contains('new blog').click();
    cy.get('input[name=title').type('Test title');
    cy.get('input[name=author').type('Test author');
    cy.get('button').contains('create').click();
    cy.contains('Test title');
  });
  it('user can like a blog', () => {
    cy.get('button').contains('view').click();
    cy.get('button').contains('like').click();
    cy.contains('likes: 1');
    cy.contains('likes: 0').should('not.exist');
  });
});
