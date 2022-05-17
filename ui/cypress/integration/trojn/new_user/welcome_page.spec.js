describe('login-page functionality for newly created user', () => {
  beforeEach(() => {
    //   //   // Visit the initial login page to try out login functionality
    cy.login('uvzumaya@gmail.com', 'password')
  
    //   cy.request(method, url, body)
    })
  
    it('User successfully creates office', () => {
      cy.get('.edit-number').type('new-office')
      cy.get('input.button').click()
      cy.get('select.edit-number option:selected').should('have.text', 'new-office')
      cy.get('.event-card').first().should('have.text', '+')
    })

    it('User successfully creates new event', () => {
      // cy.get('.event-card').first().should('have.text', '+').click()
      cy.get('.event-card').click()
      cy.get('.set-title').type('{selectAll}{del}Test Event')
      cy.get('textarea.set-text').type('Testing 1 2 3')
      cy.get('input.button.submit').click()

      cy.get('.event-card').last().should('have.text', 'Test Event').click()
      cy.get('.event-title').should('have.text', 'Test Event')
    })

    it('User successfully creates new attack', () => {
      cy.get('.event-card').first().next().first().should('have.text', 'Test Event').click()
      cy.get('.hamburger-button').click()
      // cy.get('.links').get('a').should('have.text', 'Attacks')
      cy.get('a[href*="attacks"]').click()
      cy.get('.edit-name').type('disrupt comms...')
      cy.get('.edit-mission-number').type('3')
      cy.get('.button').click()

    })
  
  })