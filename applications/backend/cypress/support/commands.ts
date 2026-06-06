/// <reference types="cypress" />

/**
 * Navigiert relativ zur Admin-Base (`/backend/` in Production, baseUrl in Cypress).
 * Pfade mit fuehrendem Slash werden normalisiert.
 */
Cypress.Commands.add('visitAdmin', (path: string) => {
  const normalized = path.replace(/^\//, '')
  cy.visit(normalized)
})

/** Speichern-Button der Hauptmaske (nicht verstecktes Modal). */
Cypress.Commands.add('clickMainSave', () => {
  cy.get('.mb-3.flex.gap-5.justify-end')
    .filter(':visible')
    .contains('button', 'Speichern')
    .click()
})

declare global {
  namespace Cypress {
    interface Chainable {
      visitAdmin(path: string): Chainable<void>
      clickMainSave(): Chainable<void>
    }
  }
}

export {}
