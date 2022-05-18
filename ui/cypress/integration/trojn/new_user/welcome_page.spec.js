describe('Testing creation of different components with application', () => {
  beforeEach(() => {
    //   //   // Visit the initial login page to try out login functionality
    cy.login('uvzumaya@gmail.com', 'password')
  
    //   cy.request(method, url, body)
    })
  
    // it('User successfully creates office', () => {
    //   cy.get('.edit-number').type('new-office')
    //   cy.get('input.button').click()
    //   cy.get('select.edit-number option:selected').should('have.text', 'new-office')
    //   cy.get('.event-card').first().should('have.text', '+')
    // })

    it('User successfully creates new event', () => {
      // cy.get('.event-card').first().should('have.text', '+').click()
      cy.wait(1000)
      cy.get('.event-card').first().click()
      cy.get('.set-title').type('{selectAll}{del}Test Event')
      cy.get('textarea.set-text').type('Testing 1 2 3')
      cy.get('input.button.submit').click()

      cy.get('.event-card').last().click()
      cy.get('.event-title').should('have.text', 'Test Event')
    })

    it('User successfully creates new attack', () => {
      cy.get('.event-card').first().next().first().click()
      cy.get('.hamburger-button').click()
      cy.get('a[href*="attacks"]').click()
      cy.get("rux-tab#tab-id-add.hydrated").click()
      cy.get('input#name.edit-name').type('disrupt comms...')
      cy.get('.edit-mission-number').type('3')
      cy.get('.button').click()

    })

    it('User can successfully delete existing event', () => {
      cy.get('.event-card').last().click()
      cy.get('.hamburger-button').click()
      cy.get('a[href*="settings"]').click()
      cy.get('button.button.delete').click()
    })

    it('User can successfully create a new team', () => {
      cy.wait(1000)
      cy.get('.event-card').last().click()
      cy.get('.hamburger-button').click()
      cy.get('a[href*="teams"]').click()
      cy.get('.edit-number').type('New team')
      cy.get('.button').click()

    })

    it('User can edit the team name', () => {
      cy.wait(1000)
      cy.get('.event-card').last().click()
      cy.get('.hamburger-button').click()
      cy.get('a[href*="teams"]').click()
      cy.get('.svg.edit-team').click()
      cy.get('.edit-name').type('newer team')
      cy.get('.button').first().click()
    })

    it('User can navigate to Report page', () => {
      cy.wait(1000)
      cy.get('.event-card').last().click()
      cy.get('.hamburger-button').click()
      cy.get('a[href*="report"]').click()
      cy.get('.info-item').first().should('have.text', 'Total Attacks: 0')
    })
  
  })