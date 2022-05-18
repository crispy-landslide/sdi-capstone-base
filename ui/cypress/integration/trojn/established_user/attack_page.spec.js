function getRandomNumber(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const randNumber = getRandomNumber(1, 6)

describe('attack-page functionality', () => {
  beforeEach(() => {
    cy.login('test@email.com', 'password')
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.get('.event-card').next().first().click()
    cy.get('h1.event-title').should('have.text', 'fugit')
    cy.get('.hamburger-button').click()
    cy.get('a[href*="attacks"]').click()
  })
  
  it('Sucessfully switch between mission tabs', () => {
    cy.get('rux-tab#tab-id-61').click();
    cy.get('h2').should('contain.text', 'debitis');
    cy.get('rux-tab#tab-id-62').click();
    cy.get('h2').should('contain.text', 'incidunt');
  })

  it('Successfully create a new attack', () => {
    cy.get('button.add-attack-button').first().click();
    cy.get('input#attack.edit-number.edit-id').first().type('9999');
    cy.get('input#variant.edit-number.edit-id').first().type('9999');
    cy.get('input.submit-button').first().click();
    cy.wait(1000);
    cy.get('div.attack-card').within(() =>{
      cy.get('div.attack-id.info-low').should('contain.text', 'M1A9999V9999');
    })
  })

  it('Sucessfully open details for an attack', () => {
    cy.get('.attack-card').contains('M1A9999V9999').click();
    cy.get('div.attack-details-title').last().should('contain.text', 'Likelihood')
  })

  it('Sucessfully close details for an attack', () => {
    cy.get('.attack-card').contains('M1A9999V9999').click();
    cy.get('img.close').click();
    cy.contains('Likelihood').should('not.exist')
  })

  it('Sucessfully edit an attack', () => {
    cy.get('.attack-card').contains('M1A9999V9999').click();
    cy.get('img.edit').click()
    cy.get('input#likelihood_score.edit-number').type(`{backspace}${randNumber}`)
    cy.get('input.submit-button').click();
    cy.wait(1000);
    cy.get('div.attack-details-value').last().should('contain.text', `${randNumber}`)
  })

  it('Sucessfully delete an attack', () => {
    cy.get('.attack-card').contains('M1A9999V9999').click();
    cy.get('img.trash').click()
    cy.wait(1000);
    cy.get('.attack-card').contains('M1A9999V9999').should('not.exist');
  })
})