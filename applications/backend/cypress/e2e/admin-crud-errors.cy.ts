describe('Admin CRUD errors', () => {
  it('stays on add form when customer create fails', () => {
    cy.intercept('POST', '**/customer', { statusCode: 500, body: { message: 'Server error' } }).as(
      'failCreate'
    )

    cy.visitAdmin('/customer/add')
    cy.get('input[name="name"]').type('Test GmbH')
    cy.get('input[name="location"]').type('Berlin')
    cy.contains('button', 'Speichern').click()

    cy.wait('@failCreate')
    cy.url().should('include', '/customer/add')
    cy.get('.error-banner').should('be.visible')
  })
})

describe('Admin project CRUD smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/project_types', { body: [{ id: '1', type: 'Festanstellung' }] }).as(
      'getProjectTypes'
    )
    cy.intercept('GET', '**/techstack_types', { body: [{ id: '1', type: 'FEDEV' }] }).as(
      'getTechStackTypes'
    )
    cy.intercept('GET', '**/techstack', { body: [] }).as('getTechStacks')
    cy.intercept('GET', '**/customer', { body: [] }).as('getCustomers')
    cy.intercept('GET', '**/project', { body: [] }).as('getProjects')
    cy.intercept('POST', '**/project', { statusCode: 201, body: {} }).as('createProject')
  })

  it('creates a project via add form', () => {
    cy.visitAdmin('/project/add')
    cy.wait('@getProjectTypes')
    cy.wait('@getTechStackTypes')
    cy.wait('@getTechStacks')
    cy.wait('@getCustomers')

    cy.get('form.container').within(() => {
      cy.get('input[name="name"]').type('Neues Projekt')
      cy.get('input[name="position"]').type('Entwickler')
      cy.get('input[name="standort"]').type('Berlin')
      cy.get('select').eq(1).select('1')
    })
    cy.clickMainSave()

    cy.wait('@createProject')
    cy.url().should('include', '/project-list')
  })
})

describe('Admin techstack CRUD smoke', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/techstack_types', { body: [{ id: '1', type: 'FEDEV' }] }).as(
      'getTechStackTypes'
    )
    cy.intercept('GET', '**/techstack', { body: [] }).as('getTechStacks')
    cy.intercept('POST', '**/techstack', { statusCode: 201, body: {} }).as('createTechStack')
  })

  it('creates a tech stack entry via add form', () => {
    cy.visitAdmin('/techstack/add')
    cy.wait('@getTechStackTypes')

    cy.get('input[name="name"]').type('Vue')
    cy.get('input[name="expertise_level"]').type('5')
    cy.get('select').select('1')
    cy.contains('button', 'Speichern').click()

    cy.wait('@createTechStack')
    cy.url().should('include', '/techstack-list')
  })
})
