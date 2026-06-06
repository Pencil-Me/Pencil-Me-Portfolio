describe('Admin navigation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/project', { body: [] }).as('getProjects')
    cy.intercept('GET', '**/techstack', { body: [] }).as('getTechStacks')
  })

  it('shows the project list view', () => {
    cy.visitAdmin('/project-list')
    cy.wait('@getProjects')
    cy.contains('h2', 'Alle Projekte')
    cy.contains('button', 'Projekt hinzufügen')
  })

  it('navigates to customer list from navbar', () => {
    cy.intercept('GET', '**/customer', { body: [] }).as('getCustomers')
    cy.visitAdmin('/project-list')
    cy.get('nav').contains('Kunden').click()
    cy.url().should('include', '/customer-list')
    cy.wait('@getCustomers')
  })

  it('creates a customer via add form', () => {
    cy.intercept('GET', '**/customer', { body: [] }).as('getCustomers')
    cy.intercept('POST', '**/customer', { statusCode: 201, body: {} }).as('createCustomer')

    cy.visitAdmin('/customer/add')
    cy.get('input[name="name"]').type('Test GmbH')
    cy.get('input[name="location"]').type('Berlin')
    cy.contains('button', 'Speichern').click()

    cy.wait('@createCustomer')
    cy.url().should('include', '/customer-list')
  })
})
