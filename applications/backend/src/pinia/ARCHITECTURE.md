# Pinia Stores — Architektur

**Stand:** 2026-05-29 (Refactoring 11)

## Stores

| Store | Datei | Verantwortung |
|-------|-------|---------------|
| `app` | `useAppStore.ts` | Loading-Counter, Fehler-Banner, `withStoreAction` |
| `projects` | `useProjectsStore.ts` | Projekte CRUD, Typen, List-Display |
| `customers` | `useCustomersStore.ts` | Kunden CRUD |
| `techstack` | `useTechStackStore.ts` | Tech-Stack CRUD, Typen |

Views nutzen `mapState` / `mapActions` aus `pinia` (Options API) oder `storeToRefs` (`<script setup>`).

## CRUD-Formular (Refactoring 11)

**Entscheidung:** Composable `runValidatedAction` in `src/composables/useCrudForm.ts` (Option A).

- Validierung zentral in `src/utils/validation/`
- Customer-Domain vollständig auf `<script setup>` migriert
- Project/TechStack Add/Edit nutzen `runValidatedAction` in Options API

## Datenfluss

Services → Inbound-Mapper (Normalisierung) → Pinia Actions → `withStoreAction` → UI  
Outbound: Send-Mapper in `src/utils/mappers/*-send.mapper.ts`

HTTP: `services/http-client.ts` (Timeout 30s, Response-Interceptor für 401/5xx)

## Tests

- Service-Specs: `src/services/*.spec.ts`
- Send-Mapper, Display-Mapper, Validation
- Store-Specs: `src/pinia/use*Store.spec.ts`
- Component: `TextInput.spec.ts`

## Migration

Vuex wurde in Refactoring 10 vollständig durch Pinia ersetzt.
