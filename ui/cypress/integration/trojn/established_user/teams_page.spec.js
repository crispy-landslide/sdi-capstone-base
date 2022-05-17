describe('welcome-page functionality', () => {
  beforeEach(() => {
  //   //   // Visit the initial login page to try out login functionality
    cy.login('test@email.com', 'password')
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.get('.event-card').next().click()
    cy.get('h1.event-title').should('have.text', 'fugit')
    cy.get('.hamburger-button').click()
    cy.get('a[href*="teams"]').click()

  //   cy.request(method, url, body)
  })

  //the following refers to this link: http://localhost:3000/offices/1/events/17/teams
  it('Sucessfully switched to another tab', () => {
    cy.get('rux-tab#tab-id-176').click();
    cy.get('h2').should('contain.text', 'quaerat');
    cy.get('rux-tab#tab-id-529').click();
    cy.get('h2').should('contain.text', 'non');
  })

  it('Successfully added a participant', () => {
    cy.get('rux-button.addParticipantButton').click();
    cy.get('input#first_name')

  })

})