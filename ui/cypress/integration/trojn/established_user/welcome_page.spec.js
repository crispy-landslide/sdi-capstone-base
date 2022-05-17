describe('welcome-page functionality', () => {
  beforeEach(() => {
    cy.login('test@email.com', 'password')
  })

  it('Sucessfully switch offices', () => {
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
  })

  it('Sucessfully open new event page', () => {
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.get('.event-card').first().click()
    cy.get('h1').should('contain.text', 'Settings for')
    cy.get('input.set-title').type('{selectAll}{del}Test Event')
    cy.get('button.button.delete').click()
  })

  it('Successfully opens an event page', () => {
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.get('.event-card').next().click()
    cy.get('h1.event-title').should('have.text', 'fugit')
  })
})