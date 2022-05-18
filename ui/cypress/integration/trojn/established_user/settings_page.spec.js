function getRandomNumber(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

const randNumber = getRandomNumber(1, 6)

describe('settings-page functionality', () => {
  beforeEach(() => {
    cy.login('test@email.com', 'password')
    cy.get('.edit-number').select('Murphy, Zboncak and Maggio');
    cy.get('select.edit-number option:selected').should('have.text', 'Murphy, Zboncak and Maggio')
    cy.wait(1000)
    cy.get('.event-card').contains('sint').click()
    cy.get('h1.event-title').should('have.text', 'sint')
    cy.get('.hamburger-button').click()
    cy.get('a[href*="settings"]').click()
  })
  
  it('Should be able to change event name', () => {
    cy.get('input#name.set-title').type('{selectall}{backspace}Edited Event')
    cy.get('input.button.submit').click()
    cy.wait(1000)
    cy.get('div.event-card').contains('Edited Event').should('exist');
    cy.get('div.event-card').contains('Edited Event').click()
    cy.get('.hamburger-button').click()
    cy.get('a[href*="settings"]').click()
    cy.get('input#name.set-title').type('{selectall}{backspace}sint')
    cy.get('input.button.submit').click()
    cy.wait(1000)
  })

  it('Should be able to change event start date', () => {
    cy.get('input#start_date.set-date').type('2022-12-31')
    cy.get('input.button.submit').click()
    cy.wait(1000)
    cy.get('div.event-card').contains('sint').click()
    cy.get('div.info-values').within(() =>{
      cy.get('div.entry').first().should('contain.text', 'Dec 30 2022')
    })
    cy.get('.hamburger-button').click()
    cy.get('a[href*="settings"]').click()
    cy.get('input#start_date.set-date').type('2021-06-12')
    cy.get('input.button.submit').click()
    cy.wait(1000)
  })

  it('Should be able to change event end date', () => {
    cy.get('input#end_date.set-date').type('2023-01-31')
    cy.get('input.button.submit').click()
    cy.wait(1000)
    cy.get('div.event-card').contains('sint').click()
    cy.get('div.info-values').within(() =>{
      cy.get('div.entry').first().next().should('contain.text', 'Jan 30 2023')
    })
    cy.get('.hamburger-button').click()
    cy.get('a[href*="settings"]').click()
    cy.get('input#end_date.set-date').type('2021-06-24')
    cy.get('input.button.submit').click()
    cy.wait(1000)
  })

  it('Should be able to change event description', () => {
    cy.get('textarea#description.set-text').type('{selectall}{backspace}Edited Description')
    cy.get('input.button.submit').click()
    cy.wait(1000)
    cy.get('div.event-card').contains('sint').click()
    cy.get('div.info-values.desc-val').within(() =>{
      cy.get('div').should('contain.text', 'Edited Description')
    })
    cy.get('.hamburger-button').click()
    cy.get('a[href*="settings"]').click()
    cy.get('textarea#description.set-text').type('{selectall}{backspace}Quidem ipsam laudantium ipsam in omnis veniam reiciendis ut provident. Non perferendis quis voluptatem recusandae voluptatem. Ut optio nam molestiae rerum laudantium tempora porro molestiae.')
    cy.get('input.button.submit').click()
    cy.wait(1000)
  })
})