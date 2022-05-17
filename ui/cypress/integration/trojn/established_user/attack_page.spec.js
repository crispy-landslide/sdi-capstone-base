describe('welcome-page functionality', () => {
  beforeEach(() => {
    cy.login('test@email.com', 'password')
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.get('.event-card').next().click()
    cy.get('h1.event-title').should('have.text', 'fugit')
    cy.get('.hamburger-button').click()
    cy.get('a[href*="attacks"]').click()
  })

  //the following refers to this link: http://localhost:3000/offices/1/events/17/teams
  it('Sucessfully switch between mission tabs', () => {
    cy.get('rux-tab#tab-id-61').click();
    cy.get('h2').should('contain.text', 'debitis');
    cy.get('rux-tab#tab-id-62').click();
    cy.get('h2').should('contain.text', 'incidunt');
  })

  it('Sucessfully open details for a mission', () => {
    cy.get('div.attack-id.info-medium').contains('M1A382V382').click();
    cy.get('div.attack-details.title')
  })
})