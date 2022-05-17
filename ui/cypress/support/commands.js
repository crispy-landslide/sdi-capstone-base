// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('login', (username, password) => {
  cy.visit('http://localhost:8080/realms/showcase-auth/protocol/openid-connect/auth?client_id=trojn-app&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=2800f6a7-00e6-445f-8aa4-1be1497d158e&response_mode=fragment&response_type=code&scope=openid&nonce=4426b466-5d5f-464f-83e6-9e1dd0d55bd2')
  cy.get('.pf-c-form-control').first().type(username)
    cy.get('.pf-c-form-control').last().type(password)
    cy.get('.pf-c-button').click()
})