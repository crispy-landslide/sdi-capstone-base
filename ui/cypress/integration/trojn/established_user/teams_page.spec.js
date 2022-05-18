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

  // it('Successfully added a participant', () => {
  //   cy.get('rux-tab#tab-id-176').click();
  //   cy.get('h2').should('contain.text', 'quaerat');
    // cy.get('rux-button.addParticipantButton').first().click();
    // cy.get('input#first_name').first().type('Fogell');
    // cy.get('input#last_name').first().type('McLovin');
    // cy.get('input#email').first().type('notreal@fake.com');
    // cy.get('input#role').first().type('Manager');
    // cy.get('select.edit-number').first().select('Editor');
    // cy.get('input.button').first().click();
  //   cy.get('rux-table').first().find('rux-table-row').last().find('rux-table-cell').first().should('contain.text', 'Fogell');
  // })

  it('Successfully edits a participant\'s role', () => {
    cy.get('rux-tab#tab-id-176').click();
    cy.get('h2').should('contain.text', 'quaerat');
    cy.get('rux-table').first().find('img.edit').first().click();
    cy.get('input#role').first().type('{selectAll}{del} test');
    cy.get('input.button').first().click();
    cy.wait(1000);
    cy.get('rux-table').first().find('rux-table-row').last().find('rux-table-cell').contains('test').should('contain.text', 'test');
    
  })

  it('Successfully deletes a participant', () => {
    cy.get('rux-tab#tab-id-176').click();
    cy.get('h2').should('contain.text', 'quaerat');
    cy.get('rux-button.addParticipantButton').first().click();
    cy.get('input#first_name').first().type('Fogell');
    cy.get('input#last_name').first().type('McLovin');
    cy.get('input#email').first().type('notreal@fake.com');
    cy.get('input#role').first().type('Manager');
    cy.get('select.edit-number').first().select('Editor');
    cy.get('input.button').first().click();
    cy.wait(1500);
    cy.get('rux-table').first().find('img.edit').last().click();
    // cy.wait(1000);
    cy.get('img.trash').first().click();
    cy.wait(1500);
    cy.get('rux-table').first().find('rux-table-row').last().find('rux-table-cell').contains('Fogell').should('not.exist')
  })

})