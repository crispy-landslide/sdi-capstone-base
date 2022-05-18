function getRandomNumber(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const randNumber = getRandomNumber(1, 6)

describe('reports-page functionality', () => {
  beforeEach(() => {
    cy.login('test@email.com', 'password')
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.get('.event-card').next().first().click()
    cy.get('h1.event-title').should('have.text', 'fugit')
    cy.get('.hamburger-button').click()
    cy.get('a[href*="report"]').click()
  })
  
  it('Should display total number of attacks and risk level', () => {
    cy.get('div.info-item').contains('Total Attacks').should('exist');
    cy.get('div.info-item.info-high').contains('High Risk').should('exist');
    cy.get('div.info-item.info-medium').contains('Medium Risk').should('exist');
    cy.get('div.info-item.info-low').contains('Low Risk').should('exist');
  })

  it('Should display risk matrix', () => {
    cy.get('div.x-label-wrapper').should('exist')
  })

  it('Should take user to attacks page when attack within matix is clicked', () => {
    cy.get('div.risk-block.low').within(() =>{
      cy.get('div.attack-id-link.low').contains('M6A244V244').click();
    })
    cy.wait(1000)
    cy.get('div.attack-details-id.info-medium').contains('M6A244V244').should('exist')
  })
})