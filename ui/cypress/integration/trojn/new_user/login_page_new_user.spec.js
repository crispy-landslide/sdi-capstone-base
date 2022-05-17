describe('login-page functionality for newly created user', () => {
  beforeEach(() => {
  //   //   // Visit the initial login page to try out login functionality
  cy.visit('http://localhost:8080/realms/showcase-auth/protocol/openid-connect/auth?client_id=trojn-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=2800f6a7-00e6-445f-8aa4-1be1497d158e&response_mode=fragment&response_type=code&scope=openid&nonce=4426b466-5d5f-464f-83e6-9e1dd0d55bd2')
  
  //   cy.request(method, url, body)
  })
  
    it('Successfully logins new registered user into account', () => {
  
      cy.get('.pf-c-form-control').first().type('uvzumaya@gmail.com')
      cy.get('.pf-c-form-control').last().type('password')
      cy.get('.pf-c-button').click()
  
      cy.get('.button').should('have.value', 'Create office')
    })
  })