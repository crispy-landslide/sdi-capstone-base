describe('login-page functionality', () => {
beforeEach(() => {
//   //   // Visit the initial login page to try out login functionality
cy.visit('http://localhost:8080/realms/showcase-auth/protocol/openid-connect/auth?client_id=trojn-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=2800f6a7-00e6-445f-8aa4-1be1497d158e&response_mode=fragment&response_type=code&scope=openid&nonce=4426b466-5d5f-464f-83e6-9e1dd0d55bd2')

//   cy.request(method, url, body)
})

  it('Successfully logins registered user into account', () => {
    
    cy.get('.pf-c-form-control').first().type('test@email.com')
    cy.get('.pf-c-form-control').last().type('password')
    cy.get('.pf-c-button').click()

    cy.get('.filter-buttons button').first().should('have.text', 'All Events')
    cy.get('.filter-buttons button').next().first().should('have.text', 'Past Events')
    cy.get('.filter-buttons button').last().should('have.text', 'Upcoming Events')
  })
})